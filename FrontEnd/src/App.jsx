import React from "react";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Games from "./pages/Games";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Account from "./pages/Account";
import "./css/base.css";
import "./css/responsive.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import GameDetails from "./pages/GameDetails";
import Register from "./pages/Register";

function App() {
  return (
    <div
      style={{
        backgroundColor: "#0F0F0F",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavigationBar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/games/:id" element={<GameDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
