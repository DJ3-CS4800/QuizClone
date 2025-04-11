import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import arrow icons
import { useNavigate } from "react-router-dom";

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
  deckId: string;
}

export default function StudyDeck({ deckId }: StudyDeckProps) {
  const navigate = useNavigate();
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    async function fetchDeck() {
      try {
        const response = await fetch(`https://quizclone.com/api/deck/${deckId}`, {
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

  const handleStudyClick = () => {
    navigate(`/study/${deck.deckWithProgress.deckID}`);
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{deck.deckName}</h1>

      <div className="text-sm text-muted-foreground mb-4">
        <p>
          <strong className="text-[var(--accent)]">Created by:</strong> {deck.ownerName}
        </p>
        <p>
          <strong className="text-[var(--accent)]">Created At:</strong> {new Date(deck.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong className="text-[var(--accent)]">Updated At:</strong> {new Date(deck.updatedAt).toLocaleDateString()}
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
          className="w-[800px] h-[400px] flex items-center justify-center bg-card select-none text-card-foreground rounded-lg shadow-lg border border-border cursor-pointer p-25 transition-transform transform hover:scale-101"
          onClick={handleFlip}
        >
          {
            isFlipped ? (
              <p className="text-lg break-words">{currentCard.answer}</p>
            ) : (
              <p className="text-lg font-semibold break-words">{currentCard.question}</p>
            )
          }
        </div>

        <button
          onClick={handleNext}
          className="w-16 h-100 opacity-50 hover:opacity-100 transition-opacity cursor-pointer transition-transform transform hover:scale-125 text-[var(--accent)]"
        >
          <ChevronRight className="w-12 h-12" />
        </button>
      </div>

      <div className="flex justify-between gap-4 mb-6">
        <Button className="w-[300px] h-[100px] py-3 text-xl cursor-pointer" variant="outline" onClick={handleStudyClick}>
          <h2 className="text-lg font-semibold">Study</h2>
        </Button>
        <Button className="w-[300px] h-[100px] py-3 text-xl cursor-pointer" variant="outline">
          <h2 className="text-lg font-semibold">Edit</h2>
        </Button>
        <Button className="w-[300px] h-[100px] py-3 text-xl cursor-pointer" variant="outline">
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
