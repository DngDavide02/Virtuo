import React from "react";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Games from "./pages/Games";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import "./css/base.css";
import "./css/responsive.css";

function App() {
  return (
    <div style={{ backgroundColor: "#0F0F0F", minHeight: "100vh", color: "#F4E964" }}>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games" element={<Games />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </div>
  );
}

export default App;
