import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "../styles/deck_page.css";

function DeckPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

        // If "mode=create" -> new deck, else if there's a deckId in URL -> edit/study that deck

    const [mode, setMode] = useState("study");
    const [deckName, setDeckName] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [cards, setCards] = useState([{ question: "", answer: "" }]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get("mode") === "create") {
            setMode("create");
        }
        if (params.deckId) {
            // Fetch deck from backend
            // fetch deck from backend to view/edit/study
            // Example:
            // fetch(`http://localhost:8080/api/deck/${params.deckId}`)
            //   .then(res => res.json())
            //   .then(deck => {
            //     setDeckName(deck.name);
            //     setCards(deck.content);
            //   })
            //   .catch(err => console.error(err));
        }
    }, [location, params.deckId]);
    // Create a new deck

    const createDeck = async () => {
        if (!deckName.trim()) {
            alert("Deck name required");
            return;
        }
                // Filter out empty question/answer pairs

        const validCards = cards.filter(c => c.question.trim() && c.answer.trim());
        const deckData = {
            deckName: deckName.trim(),
            public: isPublic,
            content: validCards
        };

        try {
            const response = await fetch("http://localhost:8080/api/createDeck", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(deckData),
                credentials: "include"
            });
            const data = await response.json();
            if (data.error) {
                alert(data.error);
            } else {
                alert("Deck created!");
                                // Navigate back to main with new deck data
                navigate("/main");
            }
        } catch (err) {
            console.error(err);
            alert("Error creating deck.");
        }
    };
    // For study/test mode: next card, previous card, shuffle, etc.

    const nextCard = () => {
        setCurrentCardIndex((idx) => (idx + 1) % cards.length);
    };
    const prevCard = () => {
        setCurrentCardIndex((idx) => (idx - 1 + cards.length) % cards.length);
    };
    const shuffleCards = () => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setCurrentCardIndex(0);
    };

    // If in "create" mode, show the deck creation UI

    if (mode === "create") {
        return (
            <div className="deck-container create-mode">
                 <h1 className="deck-title">Deck Creation</h1>
                {/* Top Bar with "Back" */}
                    <button onClick={() => navigate("/main")} className="back-button">
                        Back
                    </button>
                    <label className="DeckName">
                    <input
                        type="text"
                        placeholder="Deck Name"
                        value={deckName}
                        className="deck-name-input"
                        onChange={(e) => setDeckName(e.target.value)}
                    />
                    </label>
                    <label className="public-checkbox">
                        <input
                            type="checkbox"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                        />
                        Public
                    </label>

                <main className="deck-content">
                   
                    {cards.map((card, index) => (
    <div key={index} className={`card-input-row card-${index}`}>
        <input
            type="text"
            placeholder="Question"
            value={card.question}
            className={`card-question-input card-${index}-question`}
            onChange={(e) => {
                const updated = [...cards];
                updated[index].question = e.target.value;
                setCards(updated);
            }}
        />
        <input
            type="text"
            placeholder="Answer"
            value={card.answer}
            className={`card-answer-input card-${index}-answer`}
            onChange={(e) => {
                const updated = [...cards];
                updated[index].answer = e.target.value;
                setCards(updated);
            }}
        />
        <button
            onClick={() => {
                if (cards.length > 1) {
                    const updated = cards.filter((_, i) => i !== index);
                    setCards(updated);
                } else {
                    alert("Must have at least one card.");
                }
            }}
            className="delete-card-button"
        >
            Delete
        </button>
    </div>
))}

                    <button onClick={() => setCards([...cards, { question: "", answer: "" }])} className="add-card-button">
                        Add Card
                    </button>
                </main>

                <footer className="deck-footer">
                    <button onClick={createDeck} className="create-deck-button">Create Deck</button>
                </footer>
            </div>
        );
    }

    // If not "create" mode, show the study/test UI
    return (
        <div className="deck-container study-mode">
            <header className="deck-header">
                <button onClick={() => navigate("/main")} className="back-button">
                    Back
                </button>
                                {/* Could display deck name or a search bar */}

                <div className="deck-title">{deckName || "Untitled Deck"}</div>
                <button className="settings-button">⚙</button>
            </header>

            <main className="deck-content">
                                {/* Progress circle in top-left, text of card, video support, etc. */}
                <div className="progress-circle">Progress</div>
                <div className="card-view">
                    <h2 className="card-text">TEXT OF THE CARD</h2>
                    <p>Should be able to support video playing on card.</p>
                </div>
                <div className="deck-navigation">
                    <button onClick={prevCard} className="prev-card-button">←</button>
                    <span className="card-index">{currentCardIndex + 1}/{cards.length || 1}</span>
                    <button onClick={nextCard} className="next-card-button">→</button>
                    <button onClick={shuffleCards} className="shuffle-button">Shuffle</button>
                </div>
                <div className="mode-buttons">
                    <button className="study-mode-button">Study</button>
                    <button className="test-mode-button">Test</button>
                    <button className="match-mode-button">Match</button>
                </div>
            </main>

            <aside className="deck-tools">
                <h3>Tools</h3>
                <ul>
                    <li className="tool-favorites">Favorites</li>
                    <li className="tool-delete">Delete</li>
                </ul>
                <h4>Questions</h4>
                <ul>
                    {cards.map((card, idx) => (
                        <li key={idx} className={`question-item question-${idx}`}>Question {idx + 1}</li>
                    ))}
                </ul>
            </aside>
        </div>
    );
}

export default DeckPage;