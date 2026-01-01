import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="page-container">
      <motion.section
        className="hero-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-text">
          <h1>AI-powered Disease Prediction</h1>
          <p>
            Select your symptoms and get a predicted disease, detailed
            description, and recommended precautions
          </p>
          <div className="hero-actions">
            <Link to="/predict" className="btn btn-primary">
              Start Prediction
            </Link>
            <Link to="/about" className="btn btn-outline">
              Learn More
            </Link>
          </div>
        </div>
        <motion.div
          className="hero-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2>How it works</h2>
          <ul>
            <li>Choose your symptoms</li>
            <li>Our model analyzes patterns</li>
            <li>Get possible disease + precautions</li>
          </ul>
        </motion.div>
      </motion.section>

      <motion.section
        className="info-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.15 }}
      >
        <motion.div className="info-card" variants={cardVariant}>
          <h3>Machine Learning</h3>
          <p>
            Trained on symptom–disease relationships using Random Forest
            classification.
          </p>
        </motion.div>
        <motion.div className="info-card" variants={cardVariant}>
          <h3>Explainable Output</h3>
          <p>
            Shows predicted disease along with human-readable descriptions and
            precautions.
          </p>
        </motion.div>

      </motion.section>
    </div>
  );
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default Home;
