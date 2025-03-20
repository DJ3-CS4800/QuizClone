import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "../styles/deck_page.css";

function DeckPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    // State variables to manage deck mode, name, visibility, cards, and current card index
    const [mode, setMode] = useState("study");
    const [deckName, setDeckName] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [cards, setCards] = useState([{ question: "", answer: "", questionMedia: null, answerMedia: null }]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
    
        // Check if the mode is set to "create" in the URL search parameters
        if (searchParams.get("mode") === "create") {
            setMode("create");
        }
    
        // If a deckId is present in the URL parameters, fetch the deck data from the server
        if (params.deckId) {
            fetch(`http://localhost:8080/api/deck/${params.deckId}`)
                .then((res) => res.json())
                .then((deck) => {
                    // Check if the deck and its content exist
                    if (deck && deck.contentWithProgress) {
                        setDeckName(deck.name);
                        setCards(deck.contentWithProgress.map(card => ({
                            question: card.question,
                            answer: card.answer,
                            questionMedia: null,  // If you want to handle media, modify accordingly
                            answerMedia: null      // Same for answer media
                        })));
                        setIsPublic(deck.trackProgress);  // Assuming you want to use trackProgress
                        setMode("study");
                    } else {
                        alert("Deck content is missing.");
                    }
                })
                .catch((err) => {
                    console.error(err);
                    alert("Failed to load deck.");
                });
                console.log("Fetching deck data...");
                console.log(cards); // Log the current state of cards
        }
    }, [location.search, params.deckId]);
    

    // Function to create a new deck
    const createDeck = async () => {
        if (!deckName.trim()) {
            alert("Deck name required");
            return;
        }

        // Filter out cards that have empty questions or answers
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
                navigate("/main");
            }
        } catch (err) {
            console.error(err);
            alert("Error creating deck.");
        }
    };

// Function to navigate to the next card
const nextCard = () => {
    const userAnswerInput = document.querySelector(".user-answer-input");
    if (userAnswerInput) {
        userAnswerInput.value = "";
    }
    setCurrentCardIndex((idx) => {
        const newIndex = (idx + 1) % cards.length;
        if (userAnswerInput) {
            userAnswerInput.value = cards[newIndex].answer;
        }
        return newIndex;
    });
};

// Function to navigate to the previous card
const prevCard = () => {
    const userAnswerInput = document.querySelector(".user-answer-input");
    if (userAnswerInput) {
        userAnswerInput.value = "";
    }
    setCurrentCardIndex((idx) => {
        const newIndex = (idx - 1 + cards.length) % cards.length;
        if (userAnswerInput) {
            userAnswerInput.value = cards[newIndex].answer;
        }
        return newIndex;
    });
};

const shuffleCards = () => {
    // Create a copy of the cards array and shuffle it
    const shuffled = [...cards]
        .map(card => ({ card, sort: Math.random() })) // Assign a random sort key
        .sort((a, b) => a.sort - b.sort) // Sort by the random key
        .map(({ card }) => card); // Extract the shuffled cards

    setCards(shuffled);
    setCurrentCardIndex(0);
};



        /**
     * Updates the current card in the cards array with an empty question and answer.
     * Uses the currentCardIndex to determine which card to update.
     * 
     * @function saveCard
     * @returns {void}
     */
const saveCard = () => {
    const updatedCards = [...cards];
    const userQuestionInput = document.querySelector(".card-question-input").value.trim();
    const userAnswerInput = document.querySelector(".user-answer-input").value.trim();
    updatedCards[currentCardIndex] = {
        ...updatedCards[currentCardIndex],
        question: userQuestionInput,
        answer: userAnswerInput,
    };

    setCards(updatedCards);
    console.log("Updated Cards After Saving:", updatedCards);

    if (currentCardIndex === cards.length - 1) {
        setCards((prevCards) => {
            const newCards = [...prevCards, { question: "", answer: "", questionMedia: null, answerMedia: null }];
            return newCards;
        });
        setCurrentCardIndex(cards.length);
    } else {
        setCurrentCardIndex((prevIndex) => prevIndex + 1);
    }

    // Clear the input fields for the new card
    document.querySelector(".card-question-input").value = "";
    document.querySelector(".user-answer-input").value = "";
     // Clear the file input elements (media-upload-input class)
     document.querySelectorAll('.media-upload-input').forEach(input => input.value = '');
};

        
// Function to delete the current card
const deleteCard = () => {
    if (cards.length > 1) {
        // Remove the current card at the current index
        const updated = cards.filter((_, i) => i !== currentCardIndex);
        
        // Update the current card index to the next valid index (if possible)
        setCards(updated);
        setCurrentCardIndex((idx) => Math.min(idx, updated.length - 1));
    } else {
        // If there's only one card left, reset the deck to a single empty card
        setCards([{ question: "", answer: "", questionMedia: null, answerMedia: null }]);
        setCurrentCardIndex(0);
    }
    
    // Clear the input fields
    document.querySelector(".card-question-input").value = "";
    document.querySelector(".user-answer-input").value = "";
    
    // Clear the file input elements (media-upload-input class)
    document.querySelectorAll('.media-upload-input').forEach(input => input.value = '');
};
        

    if (mode === "create") {
        return (
            <div className="deck-container create-mode">
                <h1 className="deck-title">Deck Creation</h1>
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
                    <div className="big-card">
                        <h2 className="big-card-question">
                            {cards[currentCardIndex]?.question || "Blank"}
                        </h2>
                        {cards[currentCardIndex]?.questionMedia && (
                            cards[currentCardIndex].questionMedia.startsWith("video") ? (
                                <video controls src={cards[currentCardIndex].questionMedia} className="question-media"></video>
                            ) : (
                                <img src={cards[currentCardIndex].questionMedia} alt="Question Media" className="question-media" />
                            )
                        )}
                        <p className="big-card-answer">
                            {cards[currentCardIndex]?.answer || "Blank"}
                        </p>
                        {cards[currentCardIndex]?.answerMedia && (
                            cards[currentCardIndex].answerMedia.startsWith("video") ? (
                                <video controls src={cards[currentCardIndex].answerMedia} className="answer-media"></video>
                            ) : (
                                <img src={cards[currentCardIndex].answerMedia} alt="Answer Media" className="answer-media" />
                            )
                        )}
                    </div>

                    <div className="card-divider"></div>

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
                                type="file"
                                accept="video/*,image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const updated = [...cards];
                                        updated[index].questionMedia = URL.createObjectURL(file);
                                        setCards(updated);
                                    }
                                }}
                                className="media-upload-input"
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
                            <input
                                type="file"
                                accept="video/*,image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const updated = [...cards];
                                        updated[index].answerMedia = URL.createObjectURL(file);
                                        setCards(updated);
                                    }
                                }}
                                className="media-upload-input"
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" viewBox="0 0 24 24">
                                    <path d="M3 6h18v2H3zM7 8v12h2V8zm4 0v12h2V8zm4 0v12h2V8zM9 4h6v2H9z" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    <button onClick={() => setCards([...cards, { question: "", answer: "", questionMedia: null, answerMedia: null }])} className="add-card-button">
                        Add Card
                    </button>
                </main>

                <footer className="deck-footer">
                    <button onClick={createDeck} className="create-deck-button">Create Deck</button>
                </footer>
            </div>
        );
    }

    const [isEditing, setIsEditing] = useState(false);


    return (
        <div className="deck-container study-mode">
      <header className="deck-header">
    <div className="top-buttons">
        <button onClick={() => navigate("/main")} className="back-button">
            Back
        </button>
        <button className="settings-button">⚙</button>
    </div>
    <div className="deck-title" onClick={() => setIsEditing(true)}>
        {isEditing ? (
            <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                onBlur={() => setIsEditing(false)}
                autoFocus
                className="deck-name-input"
            />
        ) : (
            deckName || "Untitled Deck"
        )}
    </div>
</header>


            <main className="deck-content">
                <div className="progress-circle">Progress</div>
                <div className="card-view">
                    <h2 className="card-text">
                        <input
                            type="text"
                            placeholder="Your Question"
                            value={cards[currentCardIndex]?.question || ""}
                            onChange={(e) => {
                                const updated = [...cards];
                                updated[currentCardIndex].question = e.target.value;
                                setCards(updated);
                            }}
                            className="card-question-input"
                        />
                        <input
                            type="file"
                            accept="video/*,image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const updated = [...cards];
                                    updated[currentCardIndex].questionMedia = URL.createObjectURL(file);
                                    setCards(updated);
                                }
                            }}
                            className="media-upload-input"
                        />
                        {cards[currentCardIndex]?.questionMedia && (
                            cards[currentCardIndex].questionMedia.startsWith("video") ? (
                                <video controls src={cards[currentCardIndex].questionMedia} className="question-media"></video>
                            ) : (
                                <img src={cards[currentCardIndex].questionMedia} alt="Question Media" className="question-media" />
                            )
                        )}
                    </h2>
                    <p>
                        <input
                            type="text"
                            placeholder="Your Answer"
                            className="user-answer-input"
                        />
                        <input
                            type="file"
                            accept="video/*,image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const updated = [...cards];
                                    updated[currentCardIndex].answerMedia = URL.createObjectURL(file);
                                    setCards(updated);
                                }
                            }}
                            className="media-upload-input"
                        />
                        {cards[currentCardIndex]?.answerMedia && (
                            cards[currentCardIndex].answerMedia.startsWith("video") ? (
                                <video controls src={cards[currentCardIndex].answerMedia} className="answer-media"></video>
                            ) : (
                                <img src={cards[currentCardIndex].answerMedia} alt="Answer Media" className="answer-media" />
                            )
                        )}
                    </p>
                </div>

                <header className="save-header">
 Save Card? </header>
                <div className="deck-footer">
               
                <button onClick={deleteCard} className="delete-card-button">✖</button>
                <button onClick={saveCard} className="save-card-button">✓</button>
                  
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
        </div>
    );
}



export default DeckPage;
