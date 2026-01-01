import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="page-container">
      <motion.h1
        className="page-title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        About This Project
      </motion.h1>

      <motion.div
        className="about-grid"
        initial="hidden"
        animate="visible"
        variants={containerVariant}
      >
        <motion.div className="about-card" variants={cardVariant}>
          <h2>Project Overview</h2>
          <p>
            This application predicts possible diseases based on a set of
            symptoms selected by the user. It uses a Machine Learning model
            trained on a curated dataset of symptom–disease mappings.
          </p>
        </motion.div>

        <motion.div className="about-card" variants={cardVariant}>
          <h2>Tech Stack</h2>
          <ul>
            <li>Frontend: React, React Router, Framer Motion</li>
            <li>Backend: Python Flask API</li>
            <li>ML: scikit-learn (Random Forest)</li>
            <li>Data: Disease descriptions & precautions CSVs</li>
          </ul>
        </motion.div>

        <motion.div className="about-card" variants={cardVariant}>
          <h2>Disclaimer</h2>
          <p>
            This tool is built for educational and demonstration purposes only.
            It is <strong>not</strong> a replacement for professional medical
            advice, diagnosis, or treatment.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

export default About;
