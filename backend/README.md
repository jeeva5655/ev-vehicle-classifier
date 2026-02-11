---
title: EV Vehicle Classifier
emoji: 🚗
colorFrom: purple
colorTo: blue
sdk: docker
app_port: 7860
---

# EV Vehicle Classifier API

AI-powered electric vehicle classification using MobileNetV2 deep learning features and traditional ML classifiers.

## API Endpoint

**POST** `/predict` — Upload an image to classify as Electric Bus or Electric Car.

Returns:
```json
{
  "prediction": "Electric Car 🚗",
  "confidence": 0.95
}
```
