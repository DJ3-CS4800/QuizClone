import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main.css";

const MainPage = () => {
    const navigate = useNavigate();

    // Navigation handlers for each dashboard feature
    const handleStudyMode = () => {
        navigate("/deck");
    };

    const handleCreateDeck = () => {
        // navigate to deck creation page (if implemented)
        navigate("/create-deck");
    };

    const handleProgress = () => {
        // navigate to progress summary page (if implemented)
        navigate("/progress");
    };

    const handleMatchMode = () => {
        // navigate to match mode page (if implemented)
        navigate("/match");
    };

    const handleTestMode = () => {
        // navigate to test mode page (if implemented)
        navigate("/test");
    };

    const handleSettings = () => {
        // navigate to settings page (if implemented)
        navigate("/settings");
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Dashboard</h1>
            </header>

            <section className="dashboard-grid">
                <div className="dashboard-card" onClick={handleStudyMode}>
                    <h2>Study Mode</h2>
                    <p>Start your study session.</p>
                </div>
                <div className="dashboard-card" onClick={handleCreateDeck}>
                    <h2>Create Deck</h2>
                    <p>Design your own study cards.</p>
                </div>
                <div className="dashboard-card" onClick={handleProgress}>
                    <h2>Progress</h2>
                    <p>View your study statistics.</p>
                </div>
                <div className="dashboard-card" onClick={handleMatchMode}>
                    <h2>Match Mode</h2>
                    <p>Play matching games.</p>
                </div>
                <div className="dashboard-card" onClick={handleTestMode}>
                    <h2>Test Mode</h2>
                    <p>Take a quiz to test your knowledge.</p>
                </div>
                <div className="dashboard-card" onClick={handleSettings}>
                    <h2>Settings</h2>
                    <p>Customize your experience.</p>
                </div>
            </section>
        </div>
    );
};

export default MainPage;
