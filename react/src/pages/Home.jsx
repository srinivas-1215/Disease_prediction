import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="page-container">
      <motion.section
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="hero-text"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        >
          <h1>Health Insights,<br/>Instant Predictions.</h1>
          <p>
            Advanced AI analysis for early disease detection. 
            Identify symptoms and receive instant, precautious medical guidance.
          </p>
          
          <div className="hero-actions">
            <Link to="/predict" className="btn btn-primary">
              Start Diagnosis
            </Link>
            <Link to="/about" className="btn btn-outline">
              How it Works
            </Link>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        className="info-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={gridVariant}
      >
        <motion.div className="info-card" variants={cardVariant}>
          <h3>🤖 AI-Powered Analysis</h3>
          <p>
            Utilizes a Random Forest algorithm trained on heavily validated medical datasets 
            to identify potential conditions based on your specific symptoms.
          </p>
        </motion.div>

        <motion.div className="info-card" variants={cardVariant}>
          <h3>⚡ Instant Results</h3>
          <p>
            No waiting times. Get immediate predictions along with descriptions to 
            help you understand potential health issues better.
          </p>
        </motion.div>

        <motion.div className="info-card" variants={cardVariant}>
          <h3>🛡️ Preventive Care</h3>
          <p>
            Beyond diagnosis, we provide actionable precautions and lifestyle 
            recommendations to help you manage your health proactively.
          </p>
        </motion.div>
      </motion.section>
    </div>
  );
};

const gridVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default Home;
