import pandas as pd
import numpy as np


movies = pd.read_csv("dataset/ml-32m/movies.csv")
ratings = pd.read_csv("dataset/ml-32m/ratings.csv")


ratings = ratings.sample(500_000, random_state=42)


movie_groups = ratings.groupby("movieId")
#Note: Yo part movie lai pregroup gareko rating anusar

def cosine(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def recommend(movie_title, top_k=5):
    movie_row = movies[movies["title"] == movie_title]
    if movie_row.empty:
        print("Movie not found")
        return

    movie_id = movie_row.iloc[0]["movieId"]

    if movie_id not in movie_groups.groups:
        print("Movie has no ratings in sample")
        return

    
    target = movie_groups.get_group(movie_id)[["userId", "rating"]]
    
    #target movie ko lagi rating tanne

    scores = {}

    # this part is for comparing ratings given by the same user in da dataset
    for user_id in target["userId"]:
        user_movies = ratings[ratings["userId"] == user_id]
        for _, row in user_movies.iterrows():
            mid = row["movieId"]
            if mid == movie_id:
                continue
            scores.setdefault(mid, {"dot": 0, "norm": 0, "count": 0})
            scores[mid]["dot"] += row["rating"]
            scores[mid]["norm"] += row["rating"] ** 2
            scores[mid]["count"] += 1

    
    results = []
    target_norm = np.linalg.norm(target["rating"].values)
    
    # yo chahi compute target movie norm

    for mid, v in scores.items():
        sim = v["dot"] / (target_norm * np.sqrt(v["norm"]))
        results.append((mid, sim))
        
        #yo chahi cosine similarity ho 

    results.sort(key=lambda x: x[1], reverse=True)
    
    #yo chahi sort by similarity number or sim variable

    print(f"\nBecause you watched **{movie_title}**:\n")
    for mid, score in results[:top_k]:
        title = movies[movies["movieId"] == mid]["title"].values[0]
        print(f"• {title} (score={score:.2f})")

# Example for this to work, yesko recommend syntax is "Movie title (date), make sure movie title is same in movies.csv cuz it wont work"
recommend("Toy Story (1995)")
