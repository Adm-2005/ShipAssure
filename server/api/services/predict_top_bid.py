# external imports
import os
import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor


def predict_top_bid(bids: list, model_dir: str):
    model_path = os.path.join(model_dir, 'model.pkl')
    model = pickle.load(open(model_path, 'rb'))

    data = pd.DataFrame({
        'distance': [bid['distance'] for bid in bids],
        'cargo_load': [bid['cargo_load'] for bid in bids],
        'price': [bid['price'] for bid in bids],
        'delivery_duration': [(bid['estimated_delivery_date'] - bid['shipped_at']).days for bid in bids],
        'start_weekday': [bid['shipped_at'].weekday() for bid in bids],
        'delivery_weekday': [bid['estimated_delivery_date'].weekday() for bid in bids],
        'start_month': [bid['shipped_at'].month for bid in bids],
        'delivery_month': [bid['estimated_delivery_date'].month for bid in bids],
        'price_per_km': [bid['price'] / bid['distance'] for bid in bids],
    })

    predictions = model.predict(data)
    
    top_bid_index = np.argmax(predictions)

    top_bid = bids[top_bid_index] 
    return top_bid
