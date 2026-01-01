import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchSymptoms, predictDisease } from "../api";

const Predictor = () => {
  const [symptoms, setSymptoms] = useState([]);            // [{id, label}]
  const [selectedSymptoms, setSelectedSymptoms] = useState([]); // [id,...]
  const [dropdownSymptom, setDropdownSymptom] = useState("");   // currently chosen in <select>
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Helper to prettify raw symptom text
  const prettifySymptomLabel = (s) =>
    String(s || "")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  // Normalize backend symptoms: handle ["itching", ...] OR [{id, label}, ...]
  const normalizeSymptoms = (raw) => {
    if (!Array.isArray(raw)) return [];
    return raw.map((s) => {
      if (typeof s === "string") {
        return { id: s, label: prettifySymptomLabel(s) };
      }
      return {
        id: s.id,
        label: s.label ?? prettifySymptomLabel(s.id),
      };
    });
  };

  // Load symptoms from backend on mount
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingSymptoms(true);
        setError("");
        const data = await fetchSymptoms();
        // support {symptoms: [...]} OR [...]
        const normalized = normalizeSymptoms(data.symptoms || data);
        setSymptoms(normalized);
        if (normalized.length > 0) {
          setDropdownSymptom(normalized[0].id);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load symptoms from server. Please check backend.");
      } finally {
        setLoadingSymptoms(false);
      }
    };
    load();
  }, []);

  const handleAddSymptom = () => {
    if (!dropdownSymptom) return;
    setSelectedSymptoms((prev) =>
      prev.includes(dropdownSymptom) ? prev : [...prev, dropdownSymptom]
    );
    setResult(null);
    setError("");
  };

  const removeSymptom = (id) => {
    setSelectedSymptoms((prev) => prev.filter((s) => s !== id));
    setResult(null);
  };

  const clearAll = () => {
    setSelectedSymptoms([]);
    setResult(null);
    setError("");
  };

  const handlePredict = async () => {
    setError("");
    setResult(null);

    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom before predicting.");
      return;
    }

    try {
      setLoadingPrediction(true);
      const data = await predictDisease(selectedSymptoms);
      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Prediction failed. Please try again.");
    } finally {
      setLoadingPrediction(false);
    }
  };

  // Helper: get label from id
  const getLabel = (id) => {
    const s = symptoms.find((sym) => sym.id === id);
    return s ? s.label : prettifySymptomLabel(id);
  };

  return (
    <div className="page-container">
      <motion.h1
        className="page-title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Disease Predictor
      </motion.h1>

      <motion.p
        className="page-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Select one or more symptoms from the dropdown, add them to your list, and
        click <strong>Predict Disease</strong>. The predicted disease and its
        description will be shown below.
      </motion.p>

      <div className="predictor-layout">
        {/* LEFT SIDE: Symptom selection */}
        <motion.section
          className="symptom-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="panel-header">
            <h2>Select Symptoms</h2>
            <button className="btn btn-small" onClick={clearAll}>
              Clear All
            </button>
          </div>

          {loadingSymptoms ? (
            <p>Loading symptoms...</p>
          ) : symptoms.length === 0 ? (
            <p>No symptoms loaded from server.</p>
          ) : (
            <>
              {/* Dropdown select */}
              <div className="select-row">
                <select
                  value={dropdownSymptom}
                  onChange={(e) => setDropdownSymptom(e.target.value)}
                  className="symptom-select"
                >
                  {symptoms.map((s) => (
                   <option key={s.id} value={s.id}>
                    {s.label}
                </option>

                  ))}
                </select>
                <button
                  className="btn btn-primary btn-small"
                  type="button"
                  onClick={handleAddSymptom}
                >
                  Add Symptom
                </button>
              </div>

              {/* Selected symptoms */}
              <div className="selected-chips">
                {selectedSymptoms.length === 0 ? (
                  <p className="hint-text">
                    No symptoms selected yet. Choose one from the dropdown above
                    and click <strong>Add Symptom</strong>.
                  </p>
                ) : (
                  <>
                    <p className="hint-text">
                      Selected symptoms ({selectedSymptoms.length}):
                    </p>
                    <div className="chip-container">
                      {selectedSymptoms.map((id) => (
                        <div key={id} className="chip">
                          <span>{getLabel(id)}</span>
                          <button
                            type="button"
                            className="chip-remove"
                            onClick={() => removeSymptom(id)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </motion.section>

        {/* RIGHT SIDE: Prediction result */}
        <motion.section
          className="result-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2>Prediction</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            className="btn btn-primary btn-full"
            onClick={handlePredict}
            disabled={loadingPrediction || loadingSymptoms}
          >
            {loadingPrediction ? "Predicting..." : "Predict Disease"}
          </button>

     {result && !result.error && (
  <motion.div
    className="result-card"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <h3>Predicted Disease</h3>
    <p className="disease-name">{result.disease}</p>

    <h4>Description</h4>
    <p>{result.description}</p>

    {result.precautions && result.precautions.length > 0 && (
      <>
        <h4>Precautions</h4>
        <ul className="precaution-list">
          {result.precautions.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </>
    )}
  </motion.div>
)}


          {!result && !error && (
            <p className="hint-text" style={{ marginTop: "0.8rem" }}>
              After selecting symptoms on the left, click{" "}
              <strong>Predict Disease</strong> to see the result here.
            </p>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default Predictor;
