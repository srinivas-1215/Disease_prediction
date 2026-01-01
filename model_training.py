import pandas as pd
import numpy as np
import pickle

from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# ==========================
# 1. Load main training & testing data
# ==========================
train_df = pd.read_csv("Training.csv")
test_df = pd.read_csv("Testing.csv")

TARGET_COL = "prognosis"

# OPTIONAL: fix typo in disease name if present
train_df[TARGET_COL] = train_df[TARGET_COL].replace(
    {"Paralysis (brain hemorrhageH)": "Paralysis (brain hemorrhage)"}
)
test_df[TARGET_COL] = test_df[TARGET_COL].replace(
    {"Paralysis (brain hemorrhageH)": "Paralysis (brain hemorrhage)"}
)

# Features and target
X_train_full = train_df.drop(columns=[TARGET_COL])
y_train_full = train_df[TARGET_COL]

X_test = test_df.drop(columns=[TARGET_COL])
y_test = test_df[TARGET_COL]

print("Training shape:", X_train_full.shape, "Testing shape:", X_test.shape)

# ==========================
# 2. Encode target labels (diseases)
# ==========================
label_encoder = LabelEncoder()
y_train_enc = label_encoder.fit_transform(y_train_full)
y_test_enc = label_encoder.transform(y_test)

print("Number of diseases:", len(label_encoder.classes_))
print("Diseases:", label_encoder.classes_)

# ==========================
# 3. Train RandomForest model on FULL training data
# ==========================
clf = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)

clf.fit(X_train_full, y_train_enc)

# ==========================
# 4. Evaluate model on Testing.csv
# ==========================
y_test_pred = clf.predict(X_test)
test_acc = accuracy_score(y_test_enc, y_test_pred)
print("\nTest Accuracy:", test_acc)

print("\nClassification Report (Test):")
print(classification_report(y_test_enc, y_test_pred, target_names=label_encoder.classes_))

# ==========================
# 5. Load description & precautions with NORMALIZED KEYS
# ==========================
desc_df = pd.read_csv("disease_description.csv")
prec_df = pd.read_csv("disease_precaution.csv")

def norm(name: str) -> str:
    # normalize disease names to avoid spaces / case issues
    return str(name).strip().lower()

# find disease column names in csvs
disease_col_desc = [c for c in desc_df.columns if "disease" in c.lower()][0]
disease_col_prec = [c for c in prec_df.columns if "disease" in c.lower()][0]

# --- description mapping: normalized_disease -> description ---
desc_col = [c for c in desc_df.columns if c != disease_col_desc][0]

disease_to_description = {}
for _, row in desc_df.iterrows():
    d_raw = row[disease_col_desc]
    key = norm(d_raw)
    disease_to_description[key] = row[desc_col]

# --- precautions mapping: normalized_disease -> [prec1, prec2,...] ---
precaution_cols = [c for c in prec_df.columns if "precaution" in c.lower()]

disease_to_precautions = {}
for _, row in prec_df.iterrows():
    d_raw = row[disease_col_prec]
    key = norm(d_raw)
    precaution_list = [
        str(row[c]).strip()
        for c in precaution_cols
        if pd.notna(row[c]) and str(row[c]).strip() != ""
    ]
    disease_to_precautions[key] = precaution_list

print("\nSample normalized description keys:", list(disease_to_description.keys())[:5])
print("Sample normalized precaution keys:", list(disease_to_precautions.keys())[:5])

# ==========================
# 6. Save everything to pickle
# ==========================
model_bundle = {
    "model": clf,
    "label_encoder": label_encoder,
    "disease_to_description": disease_to_description,
    "disease_to_precautions": disease_to_precautions,
}

with open("disease_model_bundle.pkl", "wb") as f:
    pickle.dump(model_bundle, f)

print("\nModel and mappings saved to 'disease_model_bundle.pkl'")
