import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LeftSidebar } from "@/components/left-sidebar";
import qclogo2 from "../../assets/qclogo2.png";

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

const StudyPage = () => {
  const navigate = useNavigate();
  const { deckID } = useParams<{ deckID: string }>();
  const { deckType } = useParams<{ deckType: string }>();
  const [leftOpen, setLeftOpen] = useState(false);
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [username] = useState(localStorage.getItem("username") || "");
  const [currentCardCount, setCurrentCardCount] = useState(0);
  const [progressSaved, setProgressSaved] = useState(false);

  const cards = deck?.deckWithProgress.contentWithProgress ?? [];

  if (!deckID) return <div className="text-center text-red-500">Invalid deck ID</div>;

  if (deckType !== "r" && deckType !== "l")
    return <div className="text-center text-red-500">Invalid link</div>;

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleLeft = () => setLeftOpen((prev) => !prev);

  const goToDeck = () => {
    updateProgress();
    navigate("/deck/" + deckType + "/" + deckID);
  };

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        if (deckType === "l") {
          const localData = localStorage.getItem("studyDecks");
          if (!localData) throw new Error("No local decks found");

          const localDecks = JSON.parse(localData);
          const foundDeck = localDecks.find((d: any) => d.deckID === deckID);

          if (!foundDeck) throw new Error("Local deck not found");

          // Map local deck to the same DeckData format
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
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      }
    };
    fetchDeck();
  }, [deckID, deckType]);

  useEffect(() => {
    if (cards.length > 0 && currentQuestionIndex < cards.length) {
      generateQuestion();
    }
  }, [cards, currentQuestionIndex]);

  const updateProgress = async () => {

    if (!deck) return;
    if (username === "" && deckType === "r") return;

    if (deckType === "l") {
      const localData = localStorage.getItem("studyDecks");
      if (!localData) return;
      const localDecks = JSON.parse(localData);
      const updatedDecks = localDecks.map((d: any) => {
        if (d.deckID === deckID) {
          return {
            ...d,
            content: deck.deckWithProgress.contentWithProgress.map((card: any) => ({
              ...card,
              totalAttempts: card.totalAttempts,
              totalCorrect: card.totalCorrect,
            })),
          };
        }
        setProgressSaved(true);
        setTimeout(() => setProgressSaved(false), 2000);
        return d;
      });
      localStorage.setItem("studyDecks", JSON.stringify(updatedDecks));
      return;
    }

    try {
      const response = await fetch(`https://quizclone.com/api/deckProgress/update/${deckID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          contentWithProgress: deck.deckWithProgress.contentWithProgress,
        }),
      });
      if (!response.ok) throw new Error("Failed to update deck progress");

      setProgressSaved(true);
      setTimeout(() => setProgressSaved(false), 2000);
    } catch (err) {
      console.error("Failed to update deck progress:", err);
    }
  };

  const generateQuestion = () => {
    const currentCard = cards[currentQuestionIndex];
    const incorrectAnswers = cards
      .filter((card) => card.cardID !== currentCard.cardID)
      .map((card) => card.answer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const allOptions = [...incorrectAnswers, currentCard.answer].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswer = (selected: string) => {
    if (showFeedback) return;
    const currentCard = cards[currentQuestionIndex];
    const isCorrect = selected === currentCard.answer;

    setSelectedAnswer(selected);
    setShowFeedback(true);
    setCurrentCardCount((prev) => prev + 1);

    if (deck) {
      deck.deckWithProgress.contentWithProgress[currentQuestionIndex].totalAttempts += 1;
      if (isCorrect) {
        deck.deckWithProgress.contentWithProgress[currentQuestionIndex].totalCorrect += 1;
      }
      setDeck(deck);
    }

    if (currentCardCount + 1 === 5) {
      setCurrentCardCount(0);
      updateProgress();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < cards.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (!deck || cards.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600 text-lg">
        Loading...
      </div>
    );
  }

  const currentCard = cards[currentQuestionIndex];

  const renderQuestion = () => (
    <div className="flex-1 p-6">
      {/* Question Progress */}
      <p className="mb-4 text-sm text-muted-foreground">
        Question {currentQuestionIndex + 1} of {cards.length}
      </p>

      {/* Question */}
      <div className="mb-6 p-6 bg-purple-100 dark:bg-purple-800 rounded-lg shadow-lg border-2 border-purple-400 dark:border-purple-600 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-purple-800 dark:text-purple-200 text-center break-words whitespace-normal">
          {currentCard.question}
        </h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {options.map((option, index) => {
          let base =
            "border p-3 rounded-lg bg-muted transition-colors duration-150 text-sm sm:text-base break-words whitespace-normal overflow-hidden";
          let feedback = "";

          if (showFeedback) {
            if (option === currentCard.answer) {
              feedback = "bg-green-100 border-green-400 text-green-700 font-semibold";
            } else if (option === selectedAnswer) {
              feedback = "bg-red-100 border-red-400 text-red-700";
            } else {
              feedback = "opacity-60";
            }
          } else {
            feedback = "hover:bg-[var(--accent2)] hover:text-[var(--accent-foreground)] dark:hover:bg-purple-700";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`${base} ${feedback} max-w-full`}
              disabled={showFeedback}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      {showFeedback && (
        <div className="mt-6 text-center">
          <Button
            onClick={handleNextQuestion}
            className="flex-1 min-w-[100px] max-w-[150px] py-2 text-sm sm:text-base cursor-pointer border border-border text-[var(--accent)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-max-content flex-col">
      <SidebarProvider defaultOpen={false} open={leftOpen} onOpenChange={setLeftOpen}>
        {/* Render the sidebar only when toggled */}
        {leftOpen && (
          <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
            <SheetContent
              side="left"
              className="w-[280px] min-w-[200px] h-full p-0 overflow-auto"
            >
              <Sidebar style={{ "--sidebar-width": "280px", height: "100%" } as React.CSSProperties}>
                <LeftSidebar />
              </Sidebar>
            </SheetContent>
          </Sheet>
        )}
        <SidebarInset className="flex-1 h-max-content">
          <div className="flex flex-col w-full h-max-content relative">
            <header className="flex h-20 items-center justify-between px-6">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleLeft}>
                  <Menu className="h-10 w-10 scale-175 text-purple-800 dark:text-purple-400" />
                  <span className="sr-only">Toggle left sidebar</span>
                </Button>
                {/* Logo Image */}
                <img
                  src={qclogo2}
                  alt="Logo"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="mb-4 text-3xl font-bold justify-center text-purple-400 dark:text-purple-400">
                Study
              </span>
              <Button variant="ghost" onClick={goToDeck}>
                <X className="h-6 w-6 scale-175 text-[var(--accent2)]" />
              </Button>
            </header>
          </div>
          <main className="flex-1 p-4 space-y-4">{renderQuestion()}</main>
          {/* Progress Saved Notification at the bottom */}
          {progressSaved && (
            <div className="text-center text-sm text-green-600 mb-4">
              Progress Saved
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default StudyPage;
