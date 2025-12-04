import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Notes from "./pages/Notes";
import "./theme.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedTheme);
    document.body.classList.toggle("dark-mode", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("darkMode", newTheme);
    document.body.classList.toggle("dark-mode", newTheme);
  };

  return (
    <Router>
      <button
        onClick={toggleTheme}
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          padding: "5px 10px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          background: darkMode ? "white" : "black",
          color: darkMode ? "black" : "white",
          zIndex: 1000,
        }}
      >
        {darkMode ? "☀ Light" : "🌙 Dark"}
      </button>

      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </Router>
  );
}

export default App;
