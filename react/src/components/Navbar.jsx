import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.header
      className="navbar"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <div className="nav-logo">🩺 MedPredict</div>
        <nav className="nav-links">
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
            to="/predict"
          >
            Predictor
          </NavLink>

        </nav>
      </div>
    </motion.header>
  );
};

export default Navbar;
