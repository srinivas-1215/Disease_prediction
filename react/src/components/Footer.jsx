import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        ⚠ This is an educational ML demo and not a medical diagnosis tool.
      </p>
      <p>© {new Date().getFullYear()} MedPredict · Built with React & Flask</p>
    </footer>
  );
};

export default Footer;
