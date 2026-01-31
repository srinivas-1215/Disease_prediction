# 🩺 Disease Prediction - AI-Powered Health Insights

An intelligent disease prediction application that uses Machine Learning to analyze symptoms and provide instant health insights. Built with a modern, premium UI featuring a medical-themed teal/emerald color palette.

![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-18.0+-61DAFB.svg)
![Flask](https://img.shields.io/badge/flask-2.0+-000000.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- 🤖 **AI-Powered Analysis**: Random Forest algorithm trained on validated medical datasets
- ⚡ **Instant Predictions**: Real-time disease prediction based on selected symptoms
- 🔍 **Smart Search**: Searchable symptom selection with intuitive chip-based UI
- 🎨 **Premium Design**: Modern glassmorphism with teal/emerald medical theme
- 📱 **Responsive**: Fully responsive design that works on all devices
- 🌊 **Smooth Animations**: Powered by Framer Motion for fluid user experience
- 🛡️ **Preventive Care**: Provides actionable precautions and recommendations

## 🎥 Demo

Visit the live application at `http://localhost:5173` after installation.

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Custom styling with CSS variables

### Backend
- **Python 3.8+** - Core language
- **Flask** - Lightweight web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Scikit-learn** - Machine learning
- **Pandas** - Data manipulation
- **NumPy** - Numerical operations

## 📋 Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/srinivas-1215/Disease_prediction.git
cd Disease_prediction
```

### 2. Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt
```

If `requirements.txt` doesn't exist, install manually:

```bash
pip install flask flask-cors pandas numpy scikit-learn
```

### 3. Frontend Setup

```bash
# Navigate to React directory
cd react

# Install dependencies
npm install

# Return to root directory
cd ..
```

## 🏃 Running the Application

### Start Backend Server

```bash
# In the root directory
python api.py
```

The Flask API will start on `http://localhost:5000`

### Start Frontend Development Server

```bash
# In a new terminal, navigate to react directory
cd react

# Start Vite dev server
npm run dev
```

The React app will start on `http://localhost:5173`

### Alternative: Using Streamlit (Legacy)

```bash
streamlit run app.py
```

Opens on `http://localhost:8501`

## 📖 Usage

1. **Home Page**: View application features and benefits
2. **Predictor Page**:
   - Search for symptoms using the search bar
   - Click symptoms to select them (they appear as chips)
   - Click "Predict Disease" to get AI analysis
   - View predicted disease, description, and precautions
3. **Results**: Review the predicted condition and recommended actions

## 🔌 API Endpoints

### `GET /symptoms`
Retrieves all available symptoms.

**Response:**
```json
{
  "symptoms": [
    {"id": "itching", "label": "Itching"},
    {"id": "skin_rash", "label": "Skin Rash"}
  ]
}
```

### `POST /predict`
Predicts disease based on symptoms.

**Request:**
```json
{
  "symptoms": ["itching", "skin_rash", "nodal_skin_eruptions"]
}
```

**Response:**
```json
{
  "disease": "Fungal infection",
  "description": "Fungal infection is caused by...",
  "precautions": [
    "bath twice",
    "use detol or neem in bathing water",
    "keep infected area dry"
  ]
}
```

## 📁 Project Structure

```
disease_prediction_app/
├── react/                    # Frontend React application
│   ├── src/
│   │   ├── components/      # Navbar, Footer
│   │   ├── pages/           # Home, Predictor, About
│   │   ├── api.js           # API integration
│   │   ├── styles.css       # Global styles
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   └── vite.config.js
├── api.py                   # Flask REST API
├── app.py                   # Streamlit app (legacy)
├── model_training.py        # ML model training script
├── disease_model_bundle.pkl # Trained ML model
├── Training.csv             # Training dataset
├── Testing.csv              # Testing dataset
└── README.md
```

## 🎨 Color Palette

The application uses a medical-themed color scheme:

- **Primary**: Teal (`#14b8a6`)
- **Secondary**: Emerald (`#10b981`)
- **Background**: Deep Slate (`#020617`)
- **Accent**: Teal 400 (`#2dd4bf`)

## 🧪 Model Training

To retrain the model with your own data:

```bash
python model_training.py
```

This will:
1. Load training data from `Training.csv`
2. Train a Random Forest Classifier
3. Save the model bundle to `disease_model_bundle.pkl`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Disclaimer

**This application is for educational and demonstration purposes only.**

- Not a substitute for professional medical advice
- Always consult healthcare professionals for medical concerns
- Predictions are based on limited symptom data and may not be accurate

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Srinivas**
- GitHub: [@srinivas-1215](https://github.com/srinivas-1215)

## 🙏 Acknowledgments

- Dataset sources for disease-symptom relationships
- Open-source libraries and frameworks
- Medical data contributors

## 📞 Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/srinivas-1215/Disease_prediction/issues)
- Check existing documentation

---

<div align="center">
Made with ❤️ for better health awareness
</div>
