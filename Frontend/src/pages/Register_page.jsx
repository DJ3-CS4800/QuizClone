import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register_page.css";

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = () => {
        fetch("http://18.223.196.87/api/account/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password": password,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(`Register failed: ${response.status} - ${text}`);
                    });
                }
                return response.json();
            })
            .then((data) => {
                // Registration successful; navigate to the main page
                navigate("/main");
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Register failed. Please check your credentials.\n" + error.message);
            });
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <div className="register-page">
            <div className="login-box">
                <h2>Register</h2>
                <div className="input-group">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
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
                <button className="Register-button" onClick={handleRegister}>
                    Register
                </button>
                <button className="Cancel-button" onClick={handleCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default RegisterPage;
