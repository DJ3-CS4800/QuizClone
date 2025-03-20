import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/main_page.css";

function MainPage() {
    const navigate = useNavigate();
    const [decks, setDecks] = useState([]);
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
            // Redirect back to Home (login) if userId is missing
            navigate("/");
            return;
        }
        setUserId(storedUserId);

        fetch(`https://quizclone.com/api/deck/all?ownerID=${storedUserId}`, {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Error fetching decks: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (data.studyDeckList) {
                    const mappedDecks = data.studyDeckList.map((deck) => ({
                        id: deck.deckID,
                        name: deck.deckName,
                        description: "Click to edit this set",
                        progress: 0,
                        favorite: false,
                    }));
                    setDecks(mappedDecks);
                }
                setLoading(false);
            })
            //currently i always end up on this error. i think it does have something to do with login based on inspect.
            //maybe maybe cause no decks initially? kinda unsure. honestly i might have just set it up wrong.
            .catch((err) => {
                console.error("Error fetching decks:", err);
                setLoading(false);
                // navigate("/"); // Redirect to Home if fetching decks fails
            });
    }, [navigate]);

    // Create a new deck without navigating away
    const handleAddSet = async () => {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
            navigate("/");
            return;
        }

        const newDeckData = {
            deckName: "New Set",
            isPublic: true,
            content: [],
        };

        try {
            const response = await fetch("https://quizclone.com/api/deck/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newDeckData),
                credentials: "include",
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response from server:", errorText);
                throw new Error(`Error creating deck: ${response.status}`);
            }

            const data = await response.json();
            console.log("Deck created successfully:", data);

            const newDeck = {
                id: data.deckID,
                name: data.deckName,
                description: "Click to edit this set",
                progress: 0,
                favorite: false,
            };

            setDecks((prevDecks) => [...prevDecks, newDeck]);
        } catch (error) {
            console.error("Failed to add new deck:", error);
            alert("Error adding new set, please try again");
        }
    };

    const openDeck = (deckId) => {
        navigate(`/deck/${deckId}`);
    };

    // Optional: Add a logout button that clears the stored user and returns to Home
    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate("/");
    };

    return (
        <div className="main-container">
            <header className="header">
                <div className="search-bar">
                    <input type="text" placeholder="Search decks..." />
                </div>
                <div className="user-section">
                    {userId}
                    <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
                        Log Out
                    </button>
                </div>
            </header>

            <h1 className="title">Dashboard</h1>
            <p className="subtitle">Manage your decks or create a new one.</p>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <main className="deck-grid">
                    {decks.length > 0 ? (
                        decks.map((deck) => (
                            <div
                                key={deck.id}
                                className="deck-card"
                                onClick={() => openDeck(deck.id)}
                            >
                                <h3>{deck.name}</h3>
                                <p>{deck.description}</p>
                                <div className="progress-circle">{deck.progress}%</div>
                            </div>
                        ))
                    ) : (
                        <p>No decks found. Click "add set" to create a new deck.</p>
                    )}
                    <div className="deck-card add-card" onClick={handleAddSet}>
                        <span className="plus-icon">+</span>
                        <span>add set</span>
                    </div>
                </main>
            )}
        </div>
    );
}

export default MainPage;
