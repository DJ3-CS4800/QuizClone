import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LeftSidebar } from "@/components/left-sidebar";

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

interface GameCard {
  id: number;
  pairId: number;
  type: "question" | "answer";
  content: string;
  matched: boolean;
  highlight: "none" | "correct" | "wrong";
}

const MAX_PAIRS = 18;

export default function MatchingPage() {
  const navigate = useNavigate();
  const { deckID } = useParams<{ deckID: string }>();
  const { deckType } = useParams<{ deckType: string }>();
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  // Holds indices of currently selected cards (awaiting match check)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [attemptCount, setAttemptCount] = useState(0);
  const [correctMatchCount, setCorrectMatchCount] = useState(0);
  const [leftOpen, setLeftOpen] = useState(false);
  const [isDarkMode] = useState(localStorage.getItem("theme") === "dark");
  // New state to disable clicking during cooldown when two wrong cards are selected.
  const [disableClick, setDisableClick] = useState(false);

  // Toggle dark mode like in QuizPage.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Load deck from local storage or a remote API.
  useEffect(() => {
    async function loadDeck() {
      try {
        if (deckType === "l") {
          const localData = localStorage.getItem("studyDecks");
          if (!localData) throw new Error("No local decks found");
          const localDecks = JSON.parse(localData);
          const foundDeck = localDecks.find((d: any) => d.deckID === deckID);
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
          const response = await fetch(`https://quizclone.com/api/deck/${deckID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
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
  }, [deckID, deckType]);

  // Initialize or reset the game.
  const initializeGameCards = useCallback(() => {
    if (!deck) return;
    let flashcards = deck.deckWithProgress.contentWithProgress;
    // If there are too many pairs, pick a random subset.
    if (flashcards.length > MAX_PAIRS) {
      flashcards = [...flashcards].sort(() => Math.random() - 0.5).slice(0, MAX_PAIRS);
    }
    // For each flashcard, create two game cards.
    const cards: GameCard[] = flashcards.flatMap((card) => {
      const questionCard: GameCard = {
        id: Math.random(),
        pairId: card.cardID,
        type: "question",
        content: card.question,
        matched: false,
        highlight: "none",
      };
      const answerCard: GameCard = {
        id: Math.random(),
        pairId: card.cardID,
        type: "answer",
        content: card.answer,
        matched: false,
        highlight: "none",
      };
      return [questionCard, answerCard];
    });
    // Shuffle the cards.
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setGameCards(cards);
    setSelectedIndices([]);
    setAttemptCount(0);
    setCorrectMatchCount(0);
  }, [deck]);

  // Reinitialize game when deck changes.
  useEffect(() => {
    if (deck) {
      initializeGameCards();
    }
  }, [deck, initializeGameCards]);

  const handleCardClick = (index: number) => {
    if (disableClick) return;
    if (selectedIndices.includes(index) || gameCards[index].matched) return;
    const newSelected = [...selectedIndices, index];
    setSelectedIndices(newSelected);

    if (newSelected.length === 2) {
      setAttemptCount((prev) => prev + 1);
      const [firstIndex, secondIndex] = newSelected;
      const firstCard = gameCards[firstIndex];
      const secondCard = gameCards[secondIndex];
      const newCards = [...gameCards];

      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        newCards[firstIndex].matched = true;
        newCards[secondIndex].matched = true;
        newCards[firstIndex].highlight = "correct";
        newCards[secondIndex].highlight = "correct";
        setGameCards(newCards);
        setCorrectMatchCount((prev) => prev + 1);
        setSelectedIndices([]);
      } else {
        newCards[firstIndex].highlight = "wrong";
        newCards[secondIndex].highlight = "wrong";
        setGameCards(newCards);
        setDisableClick(true);

        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[firstIndex].highlight = "none";
          updatedCards[secondIndex].highlight = "none";
          setGameCards(updatedCards);
          setSelectedIndices([]);
          setDisableClick(false);
        }, 1000);
      }
    }
  };

  const toggleLeft = () => setLeftOpen((prev) => !prev);
  const handleNavigation = () => {
    navigate(`/deck/${deckType}/${deckID}`);
  };

  const gameComplete = gameCards.length > 0 && gameCards.every((card) => card.matched);

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!deck) return <div className="text-center text-red-500">Deck not found</div>;

  // Dynamically compute the number of grid columns.
  // This calculates the ceiling of the square root of the total cards,
  // then clamps the value between 2 and 6.
  const gridCols = Math.max(
    2,
    Math.min(6, Math.ceil(Math.sqrt(gameCards.length)))
  );

  const renderGameCards = () =>
    gameCards.map((card, index) => {
      const baseClasses =
        "border rounded-lg cursor-pointer select-none flex items-center justify-center aspect-square transition-transform duration-200 hover:scale-103";
      let stateClasses = "";
      if (card.highlight === "correct") {
        stateClasses = "bg-green-100 border-green-400 text-green-700 font-semibold";
      } else if (card.highlight === "wrong") {
        stateClasses = "bg-red-100 border-red-400 text-red-700";
      } else if (selectedIndices.includes(index) && card.highlight === "none") {
        stateClasses = "bg-[var(--accent2)] border-[var(--accent)] text-[var(--accent3)]";
      } else {
        stateClasses = "bg-muted text-muted-foreground border-border";
      }
      return (
        <div
          key={card.id}
          className={`${baseClasses} ${stateClasses}`}
          onClick={() => handleCardClick(index)}
        >
          <span className="text-center text-sm font-medium">
            {card.content}
          </span>
        </div>
      );
    });

  if (gameComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-6 rounded-3xl shadow-md bg-muted text-center space-y-4">
          <h1 className="text-3xl font-bold">🎉 Matching Finished!</h1>
          <p className="mb-2">Total Attempts: {attemptCount}</p>
          <p className="mb-4">Correct Matches: {correctMatchCount}</p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={initializeGameCards}
              className="w-[200px] bg-[var(--accent2)] hover:bg-[var(--accent)] text-black"
            >
              Try Again
            </Button>
            <Button
              onClick={handleNavigation}
              className="w-[200px] bg-[var(--accent2)] hover:bg-[var(--accent)] text-black"
            >
              Back to Deck
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SidebarProvider defaultOpen={false} open={leftOpen} onOpenChange={setLeftOpen}>
        {leftOpen && (
          <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
            <SheetContent
              side="left"
              className="w-[280px] min-w-[200px] h-full p-0 overflow-auto"
            >
              <Sidebar
                style={{
                  "--sidebar-width": "280px",
                  height: "100%",
                } as React.CSSProperties}
              >
                <LeftSidebar />
              </Sidebar>
            </SheetContent>
          </Sheet>
        )}
        <SidebarInset className="flex-1">
          <div className="flex flex-col w-full h-max-content relative">
            <header className="flex h-20 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleLeft}>
                  <Menu className="h-6 w-6 scale-175 text-[var(--accent2)]" />
                  <span className="sr-only">Toggle left sidebar</span>
                </Button>
              </div>
              <span className="mb-4 text-2xl font-bold text-[var(--accent)]">
                Matching
              </span>
              <Button variant="ghost" onClick={handleNavigation}>
                <X className="h-6 w-6 scale-175 text-[var(--accent2)]" />
              </Button>
            </header>
          </div>
          <main className="w-full max-w-screen-xl mx-auto px-4 py-6 relative">
            <p className="mb-4 text-sm text-muted-foreground">
              Select two cards to match the question with its answer.
            </p>
            {/* Use a dynamic grid template based on computed gridCols */}
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              }}
            >
              {renderGameCards()}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
