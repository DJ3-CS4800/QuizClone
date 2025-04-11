import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Card {
    cardID: number;
    question: string;
    answer: string;
}

interface DeckData {
    deckName: string;
    deckWithProgress: {
        contentWithProgress: Card[];
        progressID: number;
        deckID: string;
        userID: string | null;
        lastOpened: string;
        isFavorite: boolean;
    };
    ownerName: string;
    createdAt: string;
    updatedAt: string;
    isOwner: boolean;
}

const QuizPage = () => {
    const { deckID } = useParams<{ deckID: string }>();
    const [deck, setDeck] = useState<DeckData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });
    const [quizFinished, setQuizFinished] = useState(false);

    const cards = deck?.deckWithProgress.contentWithProgress ?? [];

    useEffect(() => {
        const fetchDeck = async () => {
            try {
                const response = await fetch(`https://quizclone.com/api/deck/${deckID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    credentials: "include",
                });
                if (!response.ok) throw new Error("Failed to fetch deck");
                const data: DeckData = await response.json(); 
                setDeck(data);
            } catch (error) {
                console.error("Error fetching deck:", error);
                setError("Failed to load quiz deck.");
            }
        };
        fetchDeck();
    }, [deckID]);

    useEffect(() => {
        if (cards.length > 0 && currentQuestionIndex < cards.length) {
            generateQuestion();
        }
    }, [cards, currentQuestionIndex]);

    const generateQuestion = () => {
        const currentCard = cards[currentQuestionIndex];
        const incorrectAnswers = cards
            .filter((card) => card.cardID !== currentCard.cardID)
            .map((card) => card.answer)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        const allOptions = [...incorrectAnswers, currentCard.answer].sort(() => 0.5 - Math.random());
        setOptions(allOptions);
    };

    const handleAnswer = (selectedAnswer: string) => {
        const currentCard = cards[currentQuestionIndex];
        const isCorrect = selectedAnswer === currentCard.answer;

        setScore((prev) => ({
            correct: prev.correct + (isCorrect ? 1 : 0),
            incorrect: prev.incorrect + (!isCorrect ? 1 : 0),
        }));

        if (currentQuestionIndex < cards.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            setQuizFinished(true);
        }
    };

    if (error) return <p>{error}</p>;
    if (!deck || cards.length === 0) return <p>Loading...</p>;

    if (quizFinished) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Quiz Finished!</h1>
                <p>Correct: {score.correct}</p>
                <p>Incorrect: {score.incorrect}</p>
            </div>
        );
    }

    const currentCard = cards[currentQuestionIndex];

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Quiz</h1>
            <p className="mb-4">
                Question {currentQuestionIndex + 1} of {cards.length}
            </p>
            <div className="mb-4">
                <h2 className="text-lg font-semibold">{currentCard.question}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {options.map((option, index) => (
                    <button
                        key={index}
                        className="border p-2 rounded-md hover:bg-gray-200"
                        onClick={() => handleAnswer(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuizPage;
