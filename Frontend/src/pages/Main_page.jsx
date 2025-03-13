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
        // Instead of navigating to deck page, add a new blank deck card on the main page
        const newDeck = {
            id: Date.now(), // using timestamp as a temporary unique id
            name: "New Set",
            description: "Click to edit this set",
            progress: 0,
            favorite: false
        };
        setDecks(prevDecks => [...prevDecks, newDeck]);
    };

    // When returning from Deck page, it might pass newly created deck info
    // In a real app, you might fetch again or use a global store (redux/context).
    // For simplicity, assume the newly created deck is appended to state via a custom event or after navigation.

    // Open existing deck in deck page
    const openDeck = (deckId) => {
        navigate(`/deck/${deckId}`);
    };
    // Delete a deck from the main page after confirming with the user
    const deleteDeck = (deckId) => {
        if (window.confirm("Are you sure you want to delete this set?")) {
            setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
        }
    };

    // Toggle favorite for a deck and sort decks so that favorites come first
    const toggleFavorite = (deckId) => {
        setDecks(prevDecks => {
            const updatedDecks = prevDecks.map(deck => {
                if (deck.id === deckId) {
                    return { ...deck, favorite: !deck.favorite };
                }
                return deck;
            });
            // Sort updated decks so that favorited ones come first
            updatedDecks.sort((a, b) => (b.favorite - a.favorite));
            return updatedDecks;
        });
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
            {/* Temporary button to navigate to deck_page */}
            <div className="temp-deck-page-button" style={{ textAlign: 'center', margin: '1rem 0' }}>
                <button onClick={() => navigate("/deck")}>Deck page (temp button)</button>
            </div>


            <h1 className="title">Dashboard</h1>
            <p className="subtitle">Manage your decks or create a new one.</p>

            <main className="deck-grid">
                {/* Existing decks displayed here */}
                {decks.map(deck => (
                    <div key={deck.id} className="deck-card" onClick={() => openDeck(deck.id)}>
                        {/* Favorite button in the top left corner */}
                        <button
                            className="favorite-deck-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(deck.id);
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={deck.favorite ? "yellow" : "grey"}>
                                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.897l-7.336 3.86 1.402-8.168L.132 9.21l8.2-1.192z" />
                            </svg>
                        </button>
                        {/* Delete button in the top right corner */}
                        <button
                            className="delete-deck-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteDeck(deck.id);
                            }}
                        >
                            {/* Minimal trashcan icon using inline SVG with black fill */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 24 24">
                                <path d="M3 6h18v2H3zM7 8v12h2V8zm4 0v12h2V8zm4 0v12h2V8zM9 4h6v2H9z" />
                            </svg>
                        </button>
                        <h3>{deck.name}</h3>
                        <p>{deck.description || "No description"}</p>
                        <div className="progress-circle">
                            {deck.progress}%
                        </div>
                    </div>
                ))}


                {/* "Add Set" card -> always displayed as the last card */}
                <div className="deck-card add-card" onClick={handleAddSet}>
                    <span className="plus-icon">+</span>
                    <span>add set</span>
                </div>
            </main>

        </div>
    );
}

export default MainPage;
