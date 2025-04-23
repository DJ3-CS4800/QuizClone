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
                totalAttempts: card.totalAttempts || 0,
                totalCorrect: card.totalCorrect || 0,
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

  const handleClickNavigation = (location: string) => {
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

      <div className="flex items-center justify-center mb-6 pt-10 pb-5">
        <div
          className="w-full max-w-[800px] h-[50vw] max-h-[400px] flex items-center justify-center bg-card select-none text-card-foreground rounded-lg shadow-lg border border-border cursor-pointer p-6 transition-transform transform hover:scale-101 overflow-hidden"
          onClick={handleFlip}
        >
          {isFlipped ? (
            <p className="text-lg break-words overflow-hidden">{currentCard.answer}</p>
          ) : (
            <p className="text-lg font-semibold break-words overflow-hidden">{currentCard.question}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={handlePrev}
          className="w-12 h-12 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer transition-transform transform hover:scale-125"
        >
          <ChevronLeft className="w-8 h-8 text-[var(--accent)]" />
        </button>

        <span className="text-lg font-semibold text-muted-foreground">
          {currentCardIndex + 1}/{cards.length}
        </span>

        <button
          onClick={handleNext}
          className="w-12 h-12 flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity cursor-pointer transition-transform transform hover:scale-125 text-[var(--accent)]"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <Button
          className="flex-1 min-w-[100px] max-w-[150px] h-[60px] py-2 text-sm sm:text-base cursor-pointer border border-border text-[var(--accent)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
          onClick={() => handleClickNavigation("study")}
        >
          <h2 className="font-semibold">Study</h2>
        </Button>
        <Button
          className="flex-1 min-w-[100px] max-w-[150px] h-[60px] py-2 text-sm sm:text-base cursor-pointer border border-border text-[var(--accent)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
          onClick={() => handleClickNavigation("match")}
        >
          <h2 className="font-semibold">Matching</h2>
        </Button>
        {deck.isOwner && (
          <Button
            className="flex-1 min-w-[100px] max-w-[150px] h-[60px] py-2 text-sm sm:text-base cursor-pointer border border-border text-[var(--accent)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
            onClick={() => handleClickNavigation("edit")}
          >
            <h2 className="font-semibold">Edit</h2>
          </Button>
        )}
      </div>

      {/* Card List */}
      <div className="flex flex-col gap-4 pt-6">
        {deck.deckWithProgress.contentWithProgress.map((card) => (
          <div
            key={card.cardID}
            className="p-4 bg-card text-card-foreground rounded-lg shadow-lg border border-border"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1">
                <p className="font-semibold break-all overflow-hidden text-ellipsis">
                  {card.question}
                </p>
              </div>
              <div className="w-px bg-border self-stretch"></div>
              <div className="flex-1">
                <p className="text-muted-foreground break-all overflow-hidden text-ellipsis">
                  {card.answer}
                </p>
              </div>
            </div>
            {/* Conditionally render "Understanding" */}
            {(deckType === "l" || deck.deckWithProgress.userID) && (
              <div className="mt-2 text-left text-muted-foreground text-xs pt-2">
                Understanding:{" "}
                {card.totalAttempts === 0 ? (
                  <span className="text-muted-foreground">Not attempted</span>
                ) : (
                  (() => {
                    const percentage = (card.totalCorrect / card.totalAttempts) * 100;
                    const understandingColor =
                      percentage >= 80
                        ? "text-green-600"
                        : percentage >= 50
                          ? "text-yellow-600"
                          : "text-red-600";
                    return (
                      <span className={understandingColor}>
                        {`${card.totalCorrect}/${card.totalAttempts} (${percentage.toFixed(0)}%)`}
                      </span>
                    );
                  })()
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
