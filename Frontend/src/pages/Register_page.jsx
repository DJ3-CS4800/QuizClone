import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register_page.css";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleBackToLogin = () => {
        if (email && password) {
            navigate("/");
        } else {
            alert("Please enter your email and password.");
        }
    };

    return (
        <div className="register-page">
            <h2>Create an Account!</h2>
            <div className="login-box">
                    <h2>Register</h2>
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

                <button className="Register-button" onClick={handleBackToLogin}>Register</button>
        </div>
        </div>

    );
};
export default RegisterPage;
