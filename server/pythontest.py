# hybrid_recommender_safe.py
import os
import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# 1️⃣ Load datasets
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
movies_path = os.path.join(BASE_DIR, 'dataset', 'ml-32m', 'movies.csv')
ratings_path = os.path.join(BASE_DIR, 'dataset', 'ml-32m', 'ratings.csv')

movies = pd.read_csv(movies_path)
ratings = pd.read_csv(ratings_path)

# 2️⃣ Sample ratings for speed
ratings = ratings.sample(50_000, random_state=42)
sample_movie_ids = ratings['movieId'].unique()
movies = movies[movies['movieId'].isin(sample_movie_ids)].copy()

movies = movies.reset_index(drop=True)

# 3️⃣ Collaborative Filtering (KNN)
data = ratings.merge(movies, on='movieId')
data['movie_idx'] = data['movieId'].astype('category').cat.codes
data['user_idx'] = data['userId'].astype('category').cat.codes

matrix = csr_matrix((data['rating'], (data['movie_idx'], data['user_idx'])))
knn_model = NearestNeighbors(metric='cosine', algorithm='brute')
knn_model.fit(matrix)

movie_id_to_index = dict(zip(data['movieId'], data['movie_idx']))

# 4️⃣ Content-Based Filtering
movies['genres'] = movies['genres'].fillna('Unknown')
movies['year'] = movies['title'].str.extract(r'\((\d{4})\)')[0].fillna('')
movies['features'] = movies['genres'] + " " + movies['title'] + " " + movies['year']

tfidf = TfidfVectorizer(stop_words='english', max_features=5000)
tfidf_matrix = tfidf.fit_transform(movies['features'])

title_to_index = pd.Series(movies.index, index=movies['title']).drop_duplicates()


def hybrid_recommend_safe(title, top_k=10, alpha=0.7, max_cb_candidates=200):
 
    if title not in title_to_index:
        matches = movies[movies['title'].str.contains(title, case=False, na=False)]
        if matches.empty:
            return f"Movie '{title}' not found."
        title = matches.iloc[0]['title']

    idx = title_to_index[title]

   
    movie_genre = movies.iloc[idx]['genres'].split('|')[0]
    same_genre_idx = movies[movies['genres'].str.contains(movie_genre, na=False)].index
    if len(same_genre_idx) > max_cb_candidates:
        same_genre_idx = np.random.choice(same_genre_idx, max_cb_candidates, replace=False)

    content_sim = cosine_similarity(tfidf_matrix[idx], tfidf_matrix[same_genre_idx])[0]
    content_scores = np.zeros(len(movies))
    content_scores[same_genre_idx] = content_sim


    movie_id = movies.iloc[idx]['movieId']
    collab_scores = np.zeros(len(movies))
    if movie_id in movie_id_to_index:
        movie_index = movie_id_to_index[movie_id]
        distances, indices = knn_model.kneighbors(matrix[movie_index], n_neighbors=top_k+5)
        for i, dist in zip(indices[0][1:], distances[0][1:]):
            if i < len(collab_scores):
                collab_scores[i] = 1 - dist

    hybrid_score = alpha * collab_scores + (1 - alpha) * content_scores
    top_indices = hybrid_score.argsort()[::-1][1:top_k+1]  
    return movies['title'].iloc[top_indices].tolist()


if __name__ == '__main__':
    while True:
        movie_name = input("\nEnter a movie title (or 'quit' to exit): ")
        if movie_name.lower() == 'quit':
            break
        recs = hybrid_recommend_safe(movie_name, top_k=10)
        print("\nRecommended movies:")
        if isinstance(recs, str):
            print(recs)
        else:
            for i, m in enumerate(recs, 1):
                print(f"{i}. {m}")
