import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import "../styles/login.css";
import "../styles/footer.css";
import "../styles/sections.css";
import "../styles/buttons.css";
import logoImage from "../images/quizclone logo.png";


const Home = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogin = () => {
        if (email && password) {
            navigate("/main");
        } else {
            alert("Please enter your email and password.");
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    const handleQuickstart = () => {
        navigate("/deck");
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowTopBtn(window.pageYOffset > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="home-page">
            {/* NAVIGATION BAR */}
            <nav className="navbar">
                <img src={logoImage} alt="Logo" className="logo" />
                <div className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    ☰
                </div>
            </nav>


            {/* LOGIN SECTION WITH FULL BACKGROUND IMAGE AND COLOR OVERLAY */}
            <section id="login" className="login-section">
                <div className="bg-image"></div>
                <div className="color-overlay"></div>

                {/* Title Area Over the Login Box */}
                <div className="site-title">
                    <h1>QUIZCLONE</h1>
                </div>

                {/* Centered Login Box */}
                <div className="login-box">
                    <h2>Login</h2>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="options">
                        <label><input type="checkbox" /> Remember me</label>
                        <a href="#">Forgot Password?</a>
                    </div>
                    <div className="button-container">
                        <button className="sign-in-btn" onClick={handleLogin}>Login</button>
                        <button className="quickstart-btn" onClick={handleQuickstart}>Quickstart as Guest</button>
                    </div>
                    <p className="register-link">
                        Don't have an account? <span onClick={handleRegister}>Register</span>
                    </p>
                </div>
            </section>

            {/* FOOTER WITH COLUMNS */}
            <footer className="footer">
                <div className="footer-column">
                    <h3>About</h3>
                    <p>
                        Just some students trying to study
                    </p>
                </div>
                <div className="footer-column">
                    <h3>Services</h3>
                    <p>
                        Our platform offers interactive flashcards and progress tracking for free.
                    </p>
                </div>
                <div className="footer-column">
                    <h3>Contact</h3>
                    <p>please do not contact us =D</p>
                </div>
            </footer>

            {/* BACK-TO-TOP BUTTON */}
            {showTopBtn && (
                <button className="back-to-top" onClick={scrollToTop}>
                    Back to Top
                </button>
            )}
        </div>
    );
};

export default Home;
