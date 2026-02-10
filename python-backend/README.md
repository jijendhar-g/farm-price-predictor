# 🌾 AgriPrice — Python Backend (LSTM Price Prediction)

## Overview
FastAPI backend serving an LSTM-based multivariate time-series model for agricultural commodity price forecasting.

## Architecture
```
python-backend/
├── config.py              # Hyperparameters & paths
├── data_preprocessing.py  # Load, clean, normalise, window
├── lstm_model.py          # Build, train, save, load LSTM
├── evaluation.py          # MAE, RMSE, MAPE, R² metrics
├── main.py                # FastAPI application & endpoints
├── requirements.txt       # Python dependencies
├── data/
│   └── sample_data.csv    # Sample commodity price data
├── models/                # Saved model & scaler (auto-created)
└── logs/                  # Application logs (auto-created)
```

## Quick Start

```bash
cd python-backend

# 1. Create virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the server
python main.py
```

Server starts at **http://localhost:8000**

## API Endpoints

| Method | Endpoint          | Description                     |
|--------|-------------------|---------------------------------|
| GET    | `/health`         | Health check & model status     |
| POST   | `/train-model`    | Train LSTM on CSV data          |
| POST   | `/predict-price`  | Get next-day price prediction   |
| GET    | `/model-metrics`  | View latest evaluation metrics  |

### Train the model
```bash
curl -X POST http://localhost:8000/train-model \
  -H "Content-Type: application/json" \
  -d '{"filename": "sample_data.csv"}'
```

### Predict price
```bash
curl -X POST http://localhost:8000/predict-price \
  -H "Content-Type: application/json" \
  -d '{
    "commodity": "Tomato",
    "sequence": [
      [25.5, 120, 1], [26.0, 115, 1], [25.8, 118, 1],
      [26.5, 122, 1], [27.0, 125, 1], [26.8, 121, 1],
      [27.5, 128, 1], [28.0, 130, 1], [27.8, 127, 1],
      [28.5, 132, 1], [29.0, 135, 1], [28.8, 131, 1],
      [29.5, 138, 1], [30.0, 140, 1], [29.8, 136, 1],
      [30.5, 142, 1], [31.0, 145, 1], [30.8, 141, 1],
      [31.5, 148, 1], [32.0, 150, 1], [31.8, 146, 1],
      [32.5, 152, 1], [33.0, 155, 1], [32.8, 151, 1],
      [33.5, 158, 1], [34.0, 160, 1], [33.8, 156, 1],
      [34.5, 162, 1], [35.0, 165, 1], [34.8, 161, 1]
    ]
  }'
```

### View metrics
```bash
curl http://localhost:8000/model-metrics
```

## LSTM Model Architecture
```
Input (30 days × 3 features)
    ↓
LSTM (64 units, return_sequences=True)
    ↓
Dropout (0.2)
    ↓
LSTM (128 units)
    ↓
Dropout (0.2)
    ↓
Dense (1) → Predicted Price
```

## Connecting to the Frontend
Update your frontend environment to point API calls to `http://localhost:8000`.

## Evaluation Metrics
After training, the model is evaluated on a held-out test set:
- **MAE** — Mean Absolute Error (₹)
- **RMSE** — Root Mean Squared Error (₹)
- **MAPE** — Mean Absolute Percentage Error (%)
- **R²** — Coefficient of Determination (0–1)
