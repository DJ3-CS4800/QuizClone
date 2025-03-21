import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Import Button from your UI library

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

interface StudyDeckProps {
    deckId: string;  // Accept deckId as a prop
}

export default function StudyDeck({ deckId }: StudyDeckProps) {
    const [deck, setDeck] = useState<DeckData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDeck() {
            try {
                const response = await fetch(`https://quizclone.com/api/deck/${deckId}`);
                if (!response.ok) throw new Error("Failed to fetch deck");
                const data: DeckData = await response.json();
                setDeck(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        }
        fetchDeck();
    }, [deckId]);

    if (loading) return <div className="text-center text-xl">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;
    if (!deck) return <div className="text-center text-red-500">Deck not found</div>;


    const studyButtonClick = () => {
        console.log("Study button clicked");
    }

    return (
        <div className="max-w-6xl mx-auto p-6"> {/* Increased card width here */}
            <h1 className="text-3xl font-bold mb-4">{deck.deckName}</h1>

            <div className="text-sm text-muted-foreground mb-4">
                <p><strong>Created by:</strong> {deck.ownerName}</p>
                <p><strong>Created At:</strong> {new Date(deck.createdAt).toLocaleDateString()}</p>
                <p><strong>Updated At:</strong> {new Date(deck.updatedAt).toLocaleDateString()}</p>
            </div>

            <div className="flex justify-between gap-4 mb-6">
                <Button className="w-[300px] h-[100px] py-3 text-xl " variant="outline" onClick={studyButtonClick}>
                    <h2 className="text-lg font-semibold">Study</h2>
                </Button>
                <Button className="w-[300px] h-[100px] py-3 text-xl " variant="outline">
                    <h2 className="text-lg font-semibold">Edit</h2>
                </Button>
                <Button className="w-[300px] h-[100px] py-3 text-xl " variant="outline">
                    <h2 className="text-lg font-semibold">Delete Deck</h2>
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                {deck.deckWithProgress.contentWithProgress.map((card) => (
                    <div
                        key={card.cardID}
                        className="p-4 bg-card text-card-foreground rounded-lg shadow-lg border border-border"
                    >
                        <div className="flex items-stretch">
                            <div className="flex-1 flex items-start overflow-auto">
                                <p className="font-semibold break-words">{card.question}</p>
                            </div>

                            <div className="w-px bg-border mx-4"></div>

                            <div className="flex-1 flex items-start overflow-auto">
                                <h2 className="text-muted-foreground break-words">{card.answer}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
