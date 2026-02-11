import { useState, useRef, useCallback } from 'react'
import './index.css'

// ⚠️ UPDATE THIS URL after deploying to Hugging Face Spaces
const API_URL = import.meta.env.VITE_API_URL || 'https://nowherotime-ev-vehicle-classifier.hf.space'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = useCallback((file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, etc.)')
      return
    }
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleFileInput = (e) => {
    handleFile(e.target.files[0])
  }

  const removeImage = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const classifyImage = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Cannot connect to the classification server. Make sure the Hugging Face Space is running.')
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Animated Background */}
      <div className="bg-animated">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="grid-pattern"></div>

      <div className="app-wrapper">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <div className="logo-icon">⚡</div>
            <div className="logo-text">
              <h1>EV Vehicle Classifier</h1>
              <span>Powered by MobileNetV2 + ML</span>
            </div>
          </div>
        </header>

        {/* Main Card */}
        <div className="glass-card">
          <div className="card-header">
            <h2>Upload & Classify</h2>
            <p>Drop an image of an electric vehicle to identify if it's a bus or car</p>
          </div>

          {/* Upload Zone */}
          <div
            className={`upload-zone ${dragOver ? 'dragover' : ''} ${preview ? 'has-image' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />

            {preview ? (
              <div className="preview-container">
                <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeImage(); }}>✕</button>
                <img src={preview} alt="Preview" className="preview-image" />
                <span className="preview-filename">📄 {selectedFile?.name}</span>
              </div>
            ) : (
              <div className="upload-text">
                <span className="upload-icon">📸</span>
                <h3>Drag & drop your image here</h3>
                <p>or <span className="browse-link">browse files</span> to upload</p>
                <p style={{ marginTop: '8px', fontSize: '0.75rem' }}>Supports JPG, PNG, WEBP</p>
              </div>
            )}
          </div>

          {/* Classify Button */}
          <button
            className={`classify-btn ${loading ? 'loading' : ''}`}
            onClick={classifyImage}
            disabled={!selectedFile || loading}
          >
            {loading ? '🔄 Analyzing...' : '🔍 Classify Vehicle'}
          </button>

          {/* Loading State */}
          {loading && (
            <div className="spinner-container">
              <div className="spinner"></div>
              <span className="spinner-text">Running MobileNetV2 feature extraction...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error-card">
              ⚠️ {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="result-card">
              <div className="result-label">Classification Result</div>
              <div className="result-prediction">{result.prediction}</div>
              <div className="confidence-wrapper">
                <div className="confidence-label">
                  <span>Confidence</span>
                  <span>{(result.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Cards */}
        <div className="features">
          <div className="feature-item">
            <span className="feature-icon">🧠</span>
            <h4>Deep Learning</h4>
            <p>MobileNetV2 features</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <h4>Fast Inference</h4>
            <p>Real-time predictions</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <h4>High Accuracy</h4>
            <p>Trained on EV dataset</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>Built with ❤️ by JEEVA N • ML + React + Hugging Face</p>
        </footer>
      </div>
    </>
  )
}

export default App
