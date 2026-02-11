import os
import sys
import json
import re
import pickle
import numpy as np
import pandas as pd
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import torch
from ncfmodel import NeuralCollaborativeFiltering
from dotenv import load_dotenv

load_dotenv()

def debug(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)

class HybridAIRecommender:
    def __init__(self, top_similar=500):
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        self.movies_path = os.path.join(BASE_DIR, 'dataset', 'ml-32m', 'movies.csv')
        self.ratings_path = os.path.join(BASE_DIR, 'dataset', 'ml-32m', 'ratings.csv')
        self.top_similar = top_similar

        debug("Loading datasets...")
        self.movies = pd.read_csv(self.movies_path)
        self.ratings = pd.read_csv(self.ratings_path)
        self.full_ratings = self.ratings.copy()
        self.ratings_sample = self.ratings.sample(50_000, random_state=42)

        # Only keep movies in sample
        sample_movie_ids = self.ratings_sample['movieId'].unique()
        self.movies = self.movies[self.movies['movieId'].isin(sample_movie_ids)].reset_index(drop=True)

        debug("Cleaning movie titles and building TF-IDF...")
        self.movies['genres'] = self.movies['genres'].fillna('Unknown')
        self.movies['year'] = self.movies['title'].str.extract(r'\((\d{4})\)')[0].fillna('')
        self.movies['clean_title'] = self.movies['title'].apply(self.clean_title)
        self.movies['features'] = self.movies['genres'] + " " + self.movies['title'] + " " + self.movies['year']

        # TF-IDF
        self.tfidf = TfidfVectorizer(stop_words='english', max_features=2000)
        self.tfidf_matrix = self.tfidf.fit_transform(self.movies['features'])
        self.title_to_index = pd.Series(self.movies.index, index=self.movies['clean_title']).drop_duplicates()

        debug("Precomputing popularity scores...")
        self.movie_stats = self.full_ratings.groupby('movieId').agg({'rating': ['mean', 'count']}).reset_index()
        self.movie_stats.columns = ['movieId', 'avg_rating', 'rating_count']
        self.movie_stats_dict = self.movie_stats.set_index('movieId').to_dict('index')
        self.popularity_scores = np.zeros(len(self.movies))
        for i, mid in enumerate(self.movies['movieId'].values):
            if mid in self.movie_stats_dict:
                stats = self.movie_stats_dict[mid]
                self.popularity_scores[i] = stats['avg_rating'] * np.log1p(stats['rating_count'])
        if self.popularity_scores.max() > 0:
            self.popularity_scores /= self.popularity_scores.max()

        debug("Loading NCF model...")
        with open('user_mapping.pkl', 'rb') as f:
            self.user_mapping = pickle.load(f)
        with open('movie_mapping.pkl', 'rb') as f:
            self.movie_mapping = pickle.load(f)
        self.movie_idx_to_id = {v: k for k, v in self.movie_mapping.items()}

        num_users = len(self.user_mapping)
        num_movies = len(self.movie_mapping)
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = NeuralCollaborativeFiltering(num_users=num_users, num_movies=num_movies,
                                                   embedding_dim=64, hidden_layers=[128, 64, 32])
        self.model.load_state_dict(torch.load('best_ncf_model.pth', map_location=self.device))
        self.model.to(self.device)
        self.model.eval()
        self.all_movie_indices = torch.LongTensor(list(self.movie_mapping.values())).to(self.device)
        self.movie_id_to_df_idx = {mid: idx for idx, mid in enumerate(self.movies['movieId'].values)}

        debug("Connecting to MongoDB...")
        self.client = MongoClient(os.getenv('MONGODB_URI'))
        self.db = self.client['movie_recommender']
        debug("Hybrid AI Recommender ready.")

    @staticmethod
    def clean_title(title):
        title = title.lower()
        title = re.sub(r'\(\d{4}\)', '', title)
        title = re.sub(r'[^a-z0-9 ]', '', title)
        title = re.sub(r'\s+', ' ', title)
        return title.strip()

    def get_user_preferences(self, username):
        return self.db.preferences.find_one({'username': username})

    def get_popular(self, top_k=10):
        popular = self.movie_stats[self.movie_stats['rating_count'] > 100].copy()
        popular = popular.sort_values(['avg_rating', 'rating_count'], ascending=False)
        recommendations = []
        for _, row in popular.head(top_k*2).iterrows():  # fetch extra to skip missing
            mid = int(row['movieId'])
            filtered = self.movies[self.movies['movieId'] == mid]
            if filtered.empty:
                debug(f"Skipping movieId {mid}, not in movies dataset")
                continue
            movie = filtered.iloc[0]
            recommendations.append({
                'title': movie['title'],
                'genres': movie['genres'],
                'score': float(row['avg_rating']),
                'movieId': mid
            })
            if len(recommendations) >= top_k:
                break
        return recommendations

    def _get_movie_index(self, title):
        clean = self.clean_title(title)
        if clean in self.title_to_index:
            return self.title_to_index[clean]
        matches = self.movies[self.movies['clean_title'].str.contains(clean, case=False, na=False)]
        return matches.index[0] if not matches.empty else None

    def _content_top_candidates(self, idx):
        sim = cosine_similarity(self.tfidf_matrix[idx:idx+1], self.tfidf_matrix).flatten()
        sim[idx] = 0
        top_idx = np.argpartition(-sim, self.top_similar)[:self.top_similar]
        return top_idx, sim[top_idx]

    def _ncf_scores_for_user(self, user_id, candidate_movie_indices):
        if user_id not in self.user_mapping:
            return np.zeros(len(candidate_movie_indices))
        user_idx = self.user_mapping[user_id]
        user_tensor = torch.LongTensor([user_idx]*len(candidate_movie_indices)).to(self.device)
        movie_tensor = torch.LongTensor([self.movie_mapping[self.movies.iloc[i]['movieId']] for i in candidate_movie_indices]).to(self.device)
        with torch.no_grad():
            preds = self.model(user_tensor, movie_tensor).cpu().numpy()
        return preds

    def recommend(self, username, top_k=10, query=None, alpha=0.4, beta=0.4):
        prefs = self.get_user_preferences(username)
        liked = prefs.get('favoriteMovies', []) if prefs else []
        disliked = set(prefs.get('dislikedMovies', [])) if prefs else []
        fav_genres = prefs.get('selectedGenres', []) if prefs else []

        if query:
            idx = self._get_movie_index(query)
            if idx is not None:
                liked.append(self.movies.iloc[idx]['title'])

        if not liked and not fav_genres:
            return self.get_popular(top_k)

        candidate_set = set()
        content_scores = {}

        for title in liked:
            idx = self._get_movie_index(title)
            if idx is None:
                continue
            top_idx, sim_scores = self._content_top_candidates(idx)
            for i, s in zip(top_idx, sim_scores):
                candidate_set.add(i)
                content_scores[i] = max(content_scores.get(i, 0), s)

        if not candidate_set:
            return self.get_popular(top_k)

        candidate_indices = np.array(list(candidate_set))
        scores = np.zeros(len(candidate_indices))

        for i, idx in enumerate(candidate_indices):
            scores[i] += alpha * content_scores.get(idx, 0)

        for i, idx in enumerate(candidate_indices):
            scores[i] += (1 - alpha - beta) * self.popularity_scores[idx]

        user_id = username
        ncf_scores = self._ncf_scores_for_user(user_id, candidate_indices)
        scores += beta * ncf_scores / (ncf_scores.max() if ncf_scores.max() > 0 else 1)

        if fav_genres:
            for i, idx in enumerate(candidate_indices):
                genres = self.movies.iloc[idx]['genres'].split('|')
                overlap = sum(1 for g in genres if g in fav_genres)
                if overlap > 0:
                    scores[i] *= (1 + 0.15 * overlap)

        for title in disliked:
            idx = self._get_movie_index(title)
            if idx in candidate_indices:
                scores[np.where(candidate_indices == idx)[0][0]] = -999

        for title in liked:
            idx = self._get_movie_index(title)
            if idx in candidate_indices:
                scores[np.where(candidate_indices == idx)[0][0]] = -999

        top_idx = candidate_indices[np.argpartition(-scores, top_k)[:top_k]]
        top_idx = top_idx[np.argsort(-scores[np.argpartition(-scores, top_k)[:top_k]])]

        recommendations = []
        for idx in top_idx:
            if scores[np.where(candidate_indices == idx)[0][0]] <= 0:
                continue
            movie = self.movies.iloc[idx]
            movie_id = int(movie['movieId'])
            avg_rating = self.movie_stats_dict[movie_id]['avg_rating'] if movie_id in self.movie_stats_dict else float(scores[idx])
            recommendations.append({
                'title': movie['title'],
                'genres': movie['genres'],
                'score': float(scores[np.where(candidate_indices == idx)[0][0]]),
                'avgRating': float(avg_rating),
                'movieId': movie_id
            })
        return recommendations


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "testuser"
    top_k = int(sys.argv[2]) if len(sys.argv) > 2 else 10
    query = sys.argv[3] if len(sys.argv) > 3 else None

    engine = HybridAIRecommender()

    if mode == "__GLOBAL__":
        recs = engine.get_popular(top_k)
        print(json.dumps({
            'success': True,
            'recommendations': recs,
            'count': len(recs),
            'mode': 'global'
        }, indent=2))
        sys.exit(0)

    recs = engine.recommend(mode, top_k=top_k, query=query)
    print(json.dumps({
        'success': True,
        'recommendations': recs,
        'count': len(recs),
        'mode': 'personalized'
    }, indent=2))
