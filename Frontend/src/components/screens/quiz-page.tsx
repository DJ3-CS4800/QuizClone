import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface Flashcard {
    cardID: number;
    question: string;
    answer: string;
}

const QuizPage = () => {
    const { deckID } = useParams<{ deckID: string }>();
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState({ correct: 0, incorrect: 0 });

    useEffect(() => {
        // Fetch the deck's cards
        const fetchDeck = async () => {
            try {
                const response = await fetch(`https://quizclone.com/api/deck/${deckID}`);
                if (!response.ok) throw new Error("Failed to fetch deck");
                const data = await response.json();
                setCards(data.content); // Assuming `content` contains the cards
            } catch (error) {
                console.error("Error fetching deck:", error);
            }
        };

        fetchDeck();
    }, [deckID]);

    useEffect(() => {
        if (cards.length > 0) {
            generateQuestion();
        }
    }, [cards, currentQuestionIndex]);

    const generateQuestion = () => {
        const currentCard = cards[currentQuestionIndex];
        const incorrectAnswers = cards
            .filter((card) => card.cardID !== currentCard.cardID)
            .map((card) => card.answer)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3); // Select 3 random incorrect answers

        const allOptions = [...incorrectAnswers, currentCard.answer].sort(() => 0.5 - Math.random());
        setOptions(allOptions);
    };

    const handleAnswer = (selectedAnswer: string) => {
        const currentCard = cards[currentQuestionIndex];
        if (selectedAnswer === currentCard.answer) {
            setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }

        if (currentQuestionIndex < cards.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            alert(`Quiz finished! Correct: ${score.correct}, Incorrect: ${score.incorrect}`);
        }
    };

    if (cards.length === 0) return <p>Loading...</p>;

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