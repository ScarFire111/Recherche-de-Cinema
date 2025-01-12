
import os
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split
from ncfmodel import NeuralCollaborativeFiltering
import pickle

class MovieLensDataset(Dataset):
    """PyTorch Dataset for MovieLens ratings"""
    def __init__(self, user_ids, movie_ids, ratings):
        self.user_ids = torch.LongTensor(user_ids)
        self.movie_ids = torch.LongTensor(movie_ids)
        self.ratings = torch.FloatTensor(ratings)
    
    def __len__(self):
        return len(self.ratings)
    
    def __getitem__(self, idx):
        return self.user_ids[idx], self.movie_ids[idx], self.ratings[idx]

def prepare_data(ratings_path, sample_size=10_000_000):
    """Load and prepare MovieLens 32M dataset (sample for faster training)"""
    print("Loading ratings...")
    ratings = pd.read_csv(ratings_path)
    
    # Sample for practical training
    if len(ratings) > sample_size:
        ratings = ratings.sample(sample_size, random_state=42)
    print(f"Using {len(ratings):,} ratings")

    # Create categorical mappings
    user_ids = ratings['userId'].astype('category')
    movie_ids = ratings['movieId'].astype('category')

    user_mapping = {old: new for new, old in enumerate(user_ids.cat.categories)}
    movie_mapping = {old: new for new, old in enumerate(movie_ids.cat.categories)}

    # Map to indices
    ratings['user_idx'] = user_ids.cat.codes.values
    ratings['movie_idx'] = movie_ids.cat.codes.values

    # Normalize ratings to 0-1
    ratings['rating_norm'] = (ratings['rating'] - 0.5) / 5.0

    return ratings, user_mapping, movie_mapping

def train_model(model, train_loader, val_loader, epochs=10, lr=0.001, device='cuda'):
   
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=1e-5)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=2)

    model.to(device)
    best_val_loss = float('inf')

    scaler = torch.cuda.amp.GradScaler() 

    for epoch in range(epochs):
        model.train()
        train_loss = 0.0

        for user_ids, movie_ids, ratings in train_loader:
            user_ids, movie_ids, ratings = user_ids.to(device), movie_ids.to(device), ratings.to(device)

            optimizer.zero_grad()
            with torch.cuda.amp.autocast():
                predictions = model(user_ids, movie_ids)
                loss = criterion(predictions, ratings)
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()

            train_loss += loss.item()

        avg_train_loss = train_loss / len(train_loader)

        # Validation
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for user_ids, movie_ids, ratings in val_loader:
                user_ids, movie_ids, ratings = user_ids.to(device), movie_ids.to(device), ratings.to(device)
                with torch.cuda.amp.autocast():
                    predictions = model(user_ids, movie_ids)
                    loss = criterion(predictions, ratings)
                val_loss += loss.item()

        avg_val_loss = val_loss / len(val_loader)
        scheduler.step(avg_val_loss)

        print(f"Epoch {epoch+1}/{epochs} - Train Loss: {avg_train_loss:.4f} - Val Loss: {avg_val_loss:.4f}")

        # Save best model
        if avg_val_loss < best_val_loss:
            best_val_loss = avg_val_loss
            torch.save(model.state_dict(), 'best_ncf_model.pth')
            print(f"✓ Saved best model (val_loss: {avg_val_loss:.4f})")
        else:
            # Save checkpoints every epoch
            torch.save(model.state_dict(), f'checkpoint_epoch{epoch+1}.pth')

    return model

if __name__ == '__main__':
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    ratings_path = os.path.join(BASE_DIR, 'dataset', 'ml-32m', 'ratings.csv')

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")

    # Prepare data (10M ratings for training)
    ratings_df, user_mapping, movie_mapping = prepare_data(ratings_path, sample_size=10_000_000)

    # Save mappings for later inference
    with open('user_mapping.pkl', 'wb') as f:
        pickle.dump(user_mapping, f)
    with open('movie_mapping.pkl', 'wb') as f:
        pickle.dump(movie_mapping, f)

    # Split data
    train_df, val_df = train_test_split(ratings_df, test_size=0.2, random_state=42)

    # Datasets & Dataloaders
    train_dataset = MovieLensDataset(train_df['user_idx'].values, train_df['movie_idx'].values, train_df['rating_norm'].values)
    val_dataset = MovieLensDataset(val_df['user_idx'].values, val_df['movie_idx'].values, val_df['rating_norm'].values)

    train_loader = DataLoader(train_dataset, batch_size=2048, shuffle=True, num_workers=8, pin_memory=True)
    val_loader = DataLoader(val_dataset, batch_size=2048, shuffle=False, num_workers=8, pin_memory=True)

    # Model init
    num_users = ratings_df['user_idx'].max() + 1
    num_movies = ratings_df['movie_idx'].max() + 1
    print(f"Number of users: {num_users:,}, Number of movies: {num_movies:,}")

    model = NeuralCollaborativeFiltering(
        num_users=num_users,
        num_movies=num_movies,
        embedding_dim=64,
        hidden_layers=[128, 64, 32]
    )

    print(f"\nModel parameters: {sum(p.numel() for p in model.parameters()):,}")

    # Train
    print("\n" + "="*50)
    print("Starting GPU training...")
    print("="*50 + "\n")

    trained_model = train_model(model, train_loader, val_loader, epochs=15, lr=0.001, device=device)

    print("\n✓ Training completed!")
    print("Model saved as 'best_ncf_model.pth'")
