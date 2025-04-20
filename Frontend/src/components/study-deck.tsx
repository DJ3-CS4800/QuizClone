import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import arrow icons
import { useNavigate } from "react-router-dom";

interface Card {
    cardID: number;
    question: string;
    answer: string;
    totalAttempts: number;
    totalCorrect: number;
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

interface StudyDeckProps {
    deckId: string;
    deckType: string;
}

export default function StudyDeck({ deckId, deckType }: StudyDeckProps) {
    const navigate = useNavigate();
    const [deck, setDeck] = useState<DeckData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        async function loadDeck() {
            try {
                if (deckType === "l") {
                    const localData = localStorage.getItem("studyDecks");
                    if (!localData) throw new Error("No local decks found");

                    const localDecks = JSON.parse(localData);
                    const foundDeck = localDecks.find((d: any) => d.deckID === deckId);

                    if (!foundDeck) throw new Error("Local deck not found");

                    const formattedDeck: DeckData = {
                        deckName: foundDeck.deckName,
                        ownerName: foundDeck.ownerName,
                        createdAt: foundDeck.createdAt,
                        updatedAt: foundDeck.updatedAt,
                        isOwner: true,
                        deckWithProgress: {
                            contentWithProgress: foundDeck.content.map((card: any, index: number) => ({
                                cardID: card.cardID ?? index,
                                question: card.question,
                                answer: card.answer,
                            })),
                            progressID: -1,
                            deckID: foundDeck.deckID,
                            userID: null,
                            lastOpened: foundDeck.lastOpened,
                            isFavorite: foundDeck.starred || false,
                        },
                    };

                    setDeck(formattedDeck);
                } else if (deckType === "r") {
                    const response = await fetch(`https://quizclone.com/api/deck/${deckId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });
                    if (!response.ok) throw new Error("Failed to fetch remote deck");
                    const data: DeckData = await response.json();
                    setDeck(data);
                } else {
                    throw new Error("Invalid deck type");
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }

        loadDeck();
    }, [deckId, deckType]);

    if (loading) return <div className="text-center text-xl">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (!deck) return <div className="text-center text-red-500">Deck not found</div>;

    const cards = deck.deckWithProgress.contentWithProgress;
    const currentCard = cards[currentCardIndex];

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleClickNavigation = (location: String) => {
        navigate(`/deck/${deckType}/${deckId}/${location}`);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">{deck.deckName}</h1>

            <div className="text-sm text-muted-foreground mb-4">
                {deckType === "l" ? (
                    <p>
                        <strong className="text-[var(--accent)]"> </strong> Local Deck
                    </p>
                ) : (
                    <p>
                        <strong className="text-[var(--accent)]">Owner:</strong> {deck.ownerName}
                    </p>
                )}
                <p>
                    <strong className="text-[var(--accent)]">Created At:</strong>{" "}
                    {new Date(deck.createdAt).toLocaleDateString()}
                </p>
                <p>
                    <strong className="text-[var(--accent)]">Updated At:</strong>{" "}
                    {new Date(deck.updatedAt).toLocaleDateString()}
                </p>
            </div>

            <div className="flex items-center justify-center gap-6 mb-6 pt-10 pb-10">
                <button
                    onClick={handlePrev}
                    className="w-16 h-100 opacity-50 hover:opacity-100 transition-opacity cursor-pointer transition-transform transform hover:scale-125"
                >
                    <ChevronLeft className="w-12 h-12 text-[var(--accent)]" />
                </button>

                <div
                    className="w-[800px] h-[400px] flex items-center justify-center bg-card select-none text-card-foreground rounded-lg shadow-lg border border-border cursor-pointer p-6 transition-transform transform hover:scale-101 overflow-hidden"
                    onClick={handleFlip}
                >
                    {isFlipped ? (
                        <p className="text-lg break-words overflow-hidden">{currentCard.answer}</p>
                    ) : (
                        <p className="text-lg font-semibold break-words overflow-hidden">{currentCard.question}</p>
                    )}
                </div>

                <button
                    onClick={handleNext}
                    className="w-16 h-100 opacity-50 hover:opacity-100 transition-opacity cursor-pointer transition-transform transform hover:scale-125 text-[var(--accent)]"
                >
                    <ChevronRight className="w-12 h-12" />
                </button>
            </div>

            {/* Updated Buttons Section */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Button
                    className="flex-1 min-w-[100px] max-w-[150px] py-2 text-sm sm:text-base cursor-pointer border border-border text-[var(--accent)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
                    onClick={() => handleClickNavigation("study")}
                >
                    <h2 className="font-semibold">Study</h2>
                </Button>
                <Button
                    className="flex-1 min-w-[100px] max-w-[150px] py-2 text-sm sm:text-base cursor-pointer border border-border text-[var(--accent)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
                    onClick={() => handleClickNavigation("edit")}
                >
                    <h2 className="font-semibold">Edit</h2>
                </Button>
            </div>


            <div className="flex flex-col gap-4">
                {deck.deckWithProgress.contentWithProgress.map((card) => (
                    <div
                        key={card.cardID}
                        className="p-4 bg-card text-card-foreground rounded-lg shadow-lg border border-border"
                    >
                        <div className="flex items-stretch">
                            {/* Question Section */}
                            <div className="flex-1 flex items-start overflow-hidden max-h-[100px]">
                                <p className="font-semibold break-words overflow-hidden text-ellipsis">{card.question}</p>
                            </div>
                            <div className="w-px bg-border mx-4"></div>
                            {/* Answer Section */}
                            <div className="flex-1 flex items-start overflow-hidden max-h-[100px]">
                                <h2 className="text-muted-foreground break-words overflow-hidden text-ellipsis">{card.answer}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}