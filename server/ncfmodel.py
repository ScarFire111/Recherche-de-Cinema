import torch
import torch.nn as nn

class NeuralCollaborativeFiltering(nn.Module):
    """
    Neural Collaborative Filtering model for movie recommendations.
    Combines user and item embeddings with deep neural network.
    """
    def __init__(self, num_users, num_movies, embedding_dim=50, hidden_layers=[128, 64, 32]):
        super(NeuralCollaborativeFiltering, self).__init__()
        
        
        self.user_embedding = nn.Embedding(num_users, embedding_dim)
        self.movie_embedding = nn.Embedding(num_movies, embedding_dim)
        
      
        layers = []
        input_dim = embedding_dim * 2
        
        for hidden_dim in hidden_layers:
            layers.append(nn.Linear(input_dim, hidden_dim))
            layers.append(nn.ReLU())
            layers.append(nn.BatchNorm1d(hidden_dim))
            layers.append(nn.Dropout(0.2))
            input_dim = hidden_dim
        
      
        layers.append(nn.Linear(input_dim, 1))
        
        self.mlp = nn.Sequential(*layers)
        
      
        self._init_weights()
    
    def _init_weights(self):
        """Initialize embedding weights with normal distribution"""
        nn.init.normal_(self.user_embedding.weight, std=0.01)
        nn.init.normal_(self.movie_embedding.weight, std=0.01)
    
    def forward(self, user_ids, movie_ids):
        """
        Forward pass
        Args:
            user_ids: Tensor of user indices
            movie_ids: Tensor of movie indices
        Returns:
            Predicted ratings
        """
        user_embedded = self.user_embedding(user_ids)
        movie_embedded = self.movie_embedding(movie_ids)
        
       
        x = torch.cat([user_embedded, movie_embedded], dim=-1)
        
       
        output = self.mlp(x)
        
        return output.squeeze()
    
    def predict_for_user(self, user_id, movie_ids):
        """
        Predict ratings for a user across multiple movies
        Args:
            user_id: Single user ID (int)
            movie_ids: Tensor of movie indices
        Returns:
            Predicted ratings for all movies
        """
        self.eval()
        with torch.no_grad():
            user_ids = torch.full_like(movie_ids, user_id)
            predictions = self.forward(user_ids, movie_ids)
        return predictions