import streamlit as st
import pandas as pd
import numpy as np
import pickle

# ==========================
# 1. Load model bundle
# ==========================
with open("disease_model_bundle.pkl", "rb") as f:
    bundle = pickle.load(f)

model = bundle["model"]
label_encoder = bundle["label_encoder"]
disease_to_description = bundle["disease_to_description"]
disease_to_precautions = bundle["disease_to_precautions"]

# We need the same symptom order as in Training.csv
training_df = pd.read_csv("Training.csv")
symptom_cols = training_df.columns.drop('prognosis')

# ==========================
# 2. Streamlit UI
# ==========================
st.title("🩺 Disease Prediction from Symptoms")
st.write("This tool predicts a possible disease based on selected symptoms.")
st.write("⚠ This is a demo ML model and **not** a medical diagnosis.")

# Symptom selection
st.subheader("Select your symptoms:")

selected_symptoms = []
for symptom in symptom_cols:
    # Symptoms are like 'itching', 'skin_rash', etc – they are column names
    # We'll display them nicely:
    label = symptom.replace('_', ' ').title()
    if st.checkbox(label):
        selected_symptoms.append(symptom)

# ==========================
# 3. Prepare input for model
# ==========================
if st.button("Predict Disease"):
    if not selected_symptoms:
        st.warning("Please select at least one symptom.")
    else:
        # Create a zero vector and set 1 for selected symptoms
        input_vector = np.zeros(len(symptom_cols))
        for i, symptom in enumerate(symptom_cols):
            if symptom in selected_symptoms:
                input_vector[i] = 1

        input_vector = input_vector.reshape(1, -1)

        # Predict encoded label
        pred_enc = model.predict(input_vector)[0]
        disease_name = label_encoder.inverse_transform([pred_enc])[0]

        st.success(f"Predicted Disease: **{disease_name}**")

        # Show description (if available)
        desc = disease_to_description.get(disease_name, "Description not available.")
        st.subheader("📝 Disease Description")
        st.write(desc)

        # Show precautions (if available)
        precautions = disease_to_precautions.get(disease_name, [])
        st.subheader("✅ Recommended Precautions")
        if precautions:
            for p in precautions:
                st.markdown(f"- {p}")
        else:
            st.write("No precautions available for this disease.")
