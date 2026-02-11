import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import logging
import warnings
warnings.filterwarnings('ignore', category=FutureWarning)
warnings.filterwarnings('ignore', category=UserWarning)

import cv2
import numpy as np
import joblib
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input

tf.get_logger().setLevel('ERROR')
logging.getLogger('tensorflow').setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app)

# Load pretrained CNN feature extractor
feature_extractor = MobileNetV2(
    weights="imagenet",
    include_top=False,
    pooling="avg"
)

# Load trained classifier
model = joblib.load("models/best_model.pkl")

labels = ["Electric Bus 🚌", "Electric Car 🚗"]

def predict_image(image_bytes):
    """Predict vehicle type from image bytes."""
    # Decode image from bytes
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return None, 0.0
    
    # Preprocess
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img = img.astype(np.float32)
    img = preprocess_input(img)
    img = np.expand_dims(img, axis=0)
    
    # Extract features
    features = feature_extractor.predict(img, verbose=0)
    
    # Predict
    prediction = model.predict(features)[0]
    
    # Get confidence if available
    confidence = 0.95
    if hasattr(model, 'predict_proba'):
        proba = model.predict_proba(features)[0]
        confidence = float(max(proba))
    
    return labels[prediction], confidence

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "running",
        "message": "EV Vehicle Classifier API",
        "endpoints": {
            "/predict": "POST - Upload an image to classify"
        }
    })

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400
    
    try:
        image_bytes = file.read()
        label, confidence = predict_image(image_bytes)
        
        if label is None:
            return jsonify({"error": "Could not process image"}), 400
        
        return jsonify({
            "prediction": label,
            "confidence": round(confidence, 4)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860, debug=False)
