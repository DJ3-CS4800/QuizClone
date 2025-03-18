import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home_page.jsx";
import Main from "./pages/Main_page.jsx";
import Deck from "./pages/Deck_page.jsx";
import RegisterPage from "./pages/Register_page.jsx";
import "./styles/navbar.css";
import "./styles/login.css";
import "./styles/sections.css";
import "./styles/buttons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<Main />} />
      <Route path="/deck/:deckId" element={<Deck />} /> {/* Dynamic deck route */}
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  </BrowserRouter>
);
