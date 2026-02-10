"""
Configuration settings for the Agricultural Commodity Price Prediction System.
All hyperparameters, file paths, and constants are defined here.
"""

import os

# ──────────────────────────────────────────────
# File / Directory Paths
# ──────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_DIR = os.path.join(BASE_DIR, "models")
LOG_DIR = os.path.join(BASE_DIR, "logs")

# Ensure directories exist
for d in [DATA_DIR, MODEL_DIR, LOG_DIR]:
    os.makedirs(d, exist_ok=True)

MODEL_PATH = os.path.join(MODEL_DIR, "lstm_model.keras")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "metrics.json")

# ──────────────────────────────────────────────
# LSTM Hyperparameters
# ──────────────────────────────────────────────
SEQUENCE_LENGTH = 30          # Sliding window size (days of history)
LSTM_UNITS_1 = 64             # First LSTM layer units
LSTM_UNITS_2 = 128            # Second LSTM layer units
DROPOUT_RATE = 0.2            # Dropout for regularisation
EPOCHS = 50                   # Training epochs
BATCH_SIZE = 32               # Mini-batch size
VALIDATION_SPLIT = 0.1        # Fraction held out during training
TEST_SPLIT = 0.2              # Fraction held out for evaluation

# ──────────────────────────────────────────────
# Feature columns used for multivariate input
# ──────────────────────────────────────────────
FEATURE_COLUMNS = ["price", "demand", "season"]
TARGET_COLUMN = "price"

# ──────────────────────────────────────────────
# API Settings
# ──────────────────────────────────────────────
API_HOST = "0.0.0.0"
API_PORT = 8000
CORS_ORIGINS = ["*"]  # Adjust for production
