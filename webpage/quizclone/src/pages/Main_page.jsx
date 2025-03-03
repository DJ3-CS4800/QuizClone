import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main_page.css";

// Simulate existing decks or fetch from backend
const initialDecks = [
    // Example deck data
    // { id: 1, name: "Deck 1", description: "Some description", progress: 20, favorite: false },
];

function MainPage() {
    const navigate = useNavigate();
    const [decks, setDecks] = useState(initialDecks);

    // Example: fetch decks from backend on mount
    useEffect(() => {
        // fetch("http://localhost:8080/api/allDecks")
        //   .then(res => res.json())
        //   .then(data => setDecks(data.studyDeckList))
        //   .catch(err => console.error(err));
    }, []);

    // Navigate to Deck page for creation
    const handleAddSet = () => {
        navigate("/deck?mode=create");
    };

    // When returning from Deck page, it might pass newly created deck info
    // In a real app, you might fetch again or use a global store (redux/context).
    // For simplicity, assume the newly created deck is appended to state via a custom event or after navigation.

    // Open existing deck in deck page
    const openDeck = (deckId) => {
        navigate(`/deck/${deckId}`);
    };

    return (
        <div className="main-container">
            {/* Top Bar */}
            <header className="header">
                <div className="search-bar">
                    <input type="text" placeholder="Search decks..." />
                </div>
                <div className="user-section">User Account ID</div>
            </header>

            <h1 className="title">Dashboard</h1>
            <p className="subtitle">Manage your decks or create a new one.</p>

            <main className="deck-grid">
                {/* "Add Set" card -> navigates to deck creation */}
                <div className="deck-card add-card" onClick={handleAddSet}>
                    <span className="plus-icon">+</span>
                    <span>add set</span>
                </div>

                {/* Existing decks displayed here */}
                {decks.map(deck => (
                    <div key={deck.id} className="deck-card" onClick={() => openDeck(deck.id)}>
                        <h3>{deck.name}</h3>
                        <p>{deck.description || "No description"}</p>
                        <div className="progress-circle">
                            {deck.progress}%
                        </div>
                    </div>
                ))}
            </main>

            {/* Bottom Nav */}
            <footer className="bottom-nav">
                <button>Explore</button>
                <button>Saved</button>
                <button>Updates</button>
            </footer>
        </div>
    );
}

export default MainPage;
