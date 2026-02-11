# ⚡ EV Vehicle Classifier

> AI-powered electric vehicle classification using MobileNetV2 deep learning features and traditional ML classifiers.

![Architecture](https://img.shields.io/badge/Architecture-Split-blueviolet)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Flask%20%2B%20TensorFlow-green)
![Deploy](https://img.shields.io/badge/Deploy-Vercel%20%2B%20HuggingFace-orange)

## 🏗️ Architecture

```
┌─────────────┐     API Call     ┌──────────────────┐
│   Vercel     │ ──────────────► │  Hugging Face    │
│  (React UI)  │ ◄────────────── │  (Flask API)     │
│              │    JSON Result  │  MobileNetV2 +   │
│  Upload &    │                 │  SVM/RF/KNN      │
│  Display     │                 │                  │
└─────────────┘                  └──────────────────┘
```

## 🚀 Features

- **Deep Learning**: MobileNetV2 for feature extraction (transfer learning)
- **Multi-Model**: SVM, Random Forest, KNN trained and compared
- **Drag & Drop**: Modern UI with glassmorphism design
- **Real-time**: Fast inference with confidence scores
- **Responsive**: Works on desktop, tablet, and mobile

## 📂 Project Structure

```
MLDemoVSCode/
├── backend/                # Hugging Face Spaces (Flask API)
│   ├── app.py              # Flask API with /predict endpoint
│   ├── Dockerfile          # Docker config for HF Spaces
│   ├── requirements.txt    # Python dependencies
│   ├── models/             # Trained ML models (.pkl)
│   └── utils/              # MobileNetV2 feature extractor
├── frontend/               # Vercel (React + Vite)
│   ├── src/
│   │   ├── App.jsx         # Main component
│   │   └── index.css       # Premium dark UI styles
│   └── index.html
├── train.py                # Model training script
├── test.py                 # Model evaluation script
└── app.py                  # Original Flask app (legacy)
```

## 🛠️ Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `frontend/`:
```
VITE_API_URL=http://localhost:7860
```

## 👤 Author

**JEEVA N** — [ninjeeva@gmail.com](mailto:ninjeeva@gmail.com)
