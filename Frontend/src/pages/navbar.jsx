import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar({ title }) {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            {/* Back Button */}
            <button className="navbar-back-button" onClick={() => navigate(-1)}>
                &larr; Back
            </button>
            {/* Navbar Title */}
            <div className="navbar-title">
                {title || "Deck Page"}
            </div>
            {/* Placeholder for additional navbar items */}
            <div className="navbar-items">
                {/* Add additional navbar items here */}
            </div>
        </nav>
    );
}

export default Navbar;
