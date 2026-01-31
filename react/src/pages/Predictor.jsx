import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchSymptoms, predictDisease } from "../api";

const Predictor = () => {
  const [symptoms, setSymptoms] = useState([]);            // [{id, label}]
  const [selectedSymptoms, setSelectedSymptoms] = useState([]); // [id,...]
  const [searchQuery, setSearchQuery] = useState("");
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

  // Normalize backend symptoms
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

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingSymptoms(true);
        setError("");
        const data = await fetchSymptoms();
        const normalized = normalizeSymptoms(data.symptoms || data);
        setSymptoms(normalized);
      } catch (err) {
        console.error(err);
        setError("Failed to load symptoms. Please check your connection.");
      } finally {
        setLoadingSymptoms(false);
      }
    };
    load();
  }, []);

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) => {
      if (prev.includes(id)) {
        return prev.filter((s) => s !== id);
      }
      return [...prev, id];
    });
    setResult(null);
    setError("");
  };

  const clearAll = () => {
    setSelectedSymptoms([]);
    setResult(null);
    setError("");
    setSearchQuery("");
  };

  const handlePredict = async () => {
    setError("");
    setResult(null);

    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom.");
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

  const getLabel = (id) => {
    const s = symptoms.find((sym) => sym.id === id);
    return s ? s.label : prettifySymptomLabel(id);
  };

  const filteredSymptoms = useMemo(() => {
    if (!searchQuery) return symptoms;
    const lower = searchQuery.toLowerCase();
    return symptoms.filter((s) => s.label.toLowerCase().includes(lower));
  }, [symptoms, searchQuery]);

  return (
    <div className="page-container">
      <div className="predictor-layout">
        {/* LEFT PANEL */}
        <motion.section
          className="symptom-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="panel-header">
            <h2>Select Symptoms</h2>
            {selectedSymptoms.length > 0 && (
              <button className="btn btn-outline btn-small" onClick={clearAll}>
                Clear
              </button>
            )}
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search symptoms (e.g. fever, rash)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="selected-chips">
            <AnimatePresence>
              {selectedSymptoms.map((id) => (
                <motion.div
                  key={id}
                  className="chip"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  layout
                >
                  <span>{getLabel(id)}</span>
                  <button
                    className="chip-remove"
                    onClick={() => toggleSymptom(id)}
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="symptom-list">
            {loadingSymptoms ? (
              <p style={{ color: "var(--text-muted)", padding: "1rem" }}>Loading symptoms...</p>
            ) : filteredSymptoms.length === 0 ? (
              <p style={{ color: "var(--text-muted)", padding: "1rem" }}>No symptoms found.</p>
            ) : (
              filteredSymptoms.map((s) => {
                const isSelected = selectedSymptoms.includes(s.id);
                return (
                  <motion.div
                    key={s.id}
                    className={`symptom-item ${isSelected ? "symptom-item-selected" : ""}`}
                    onClick={() => toggleSymptom(s.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                    />
                    {s.label}
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.section>

        {/* RIGHT PANEL */}
        <motion.section
          className="result-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2>Prediction Results</h2>

          <div style={{ minHeight: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {!result && !loadingPrediction && !error && (
              <p className="hint-text" style={{ textAlign: "center" }}>
                Select symptoms and click Predict to see AI analysis.
              </p>
            )}

            {error && (
              <motion.div
                className="alert alert-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <button
              className="btn btn-primary btn-full"
              onClick={handlePredict}
              disabled={loadingPrediction || loadingSymptoms || selectedSymptoms.length === 0}
              style={{ marginBottom: '1.5rem' }}
            >
              {loadingPrediction ? "Analyzing..." : "Predict Disease"}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {result && !result.error && (
              <motion.div
                className="result-card"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <h3 style={{ color: "var(--text-muted)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px" }}>Likely Condition</h3>
                <p className="disease-name" style={{ fontSize: "2rem", lineHeight: "1.2", marginBottom: "1rem" }}>
                  {result.disease}
                </p>

                <h4 style={{ marginBottom: "0.5rem", color: "var(--text)" }}>Medical Description</h4>
                <p style={{ marginBottom: "1.5rem", lineHeight: "1.6" }}>{result.description}</p>

                {result.precautions && result.precautions.length > 0 && (
                  <>
                    <h4 style={{ marginBottom: "0.5rem", color: "var(--text)" }}>Recommended Actions</h4>
                    <ul className="precaution-list">
                      {result.precautions.map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          style={{ marginBottom: "0.5rem" }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </div>
  );
};

export default Predictor;
