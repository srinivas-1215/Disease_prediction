import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)

with open("disease_model_bundle.pkl", "rb") as f:
    bundle = pickle.load(f)

model = bundle["model"]
label_encoder = bundle["label_encoder"]
disease_to_description = bundle["disease_to_description"]
disease_to_precautions = bundle["disease_to_precautions"]

train_df = pd.read_csv("Training.csv")
symptom_cols = list(train_df.columns)
symptom_cols.remove("prognosis")

def norm(name: str) -> str:
    return str(name).strip().lower()

@app.route("/symptoms", methods=["GET"])
def get_symptoms():
    def prettify(col: str) -> str:
        return str(col).replace("_", " ").strip().title()

    symptoms = [{"id": col, "label": prettify(col)} for col in symptom_cols]
    return jsonify({"symptoms": symptoms})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    selected = data.get("symptoms", [])

    if not selected:
        return jsonify({"error": "No symptoms provided"}), 400

    vec = np.zeros(len(symptom_cols), dtype=int)
    for i, col in enumerate(symptom_cols):
        if col in selected:
            vec[i] = 1

    pred_enc = model.predict(vec.reshape(1, -1))[0]
    disease_name = label_encoder.inverse_transform([pred_enc])[0]

    key = norm(disease_name)  # <--- normalize before lookup

    description = disease_to_description.get(
        key, "Description not available."
    )
    precautions = disease_to_precautions.get(key, [])

    return jsonify(
        {
            "disease": disease_name,
            "description": description,
            "precautions": precautions,
        }
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
