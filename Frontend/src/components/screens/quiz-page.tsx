import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LeftSidebar } from "@/components/left-sidebar";

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
  const navigate = useNavigate();
  const { deckID } = useParams<{ deckID: string }>();
  const { deckType } = useParams<{ deckType: string }>();
  const [isMobile, setIsMobile] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);
  const [deck, setDeck] = useState<DeckData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const cards = deck?.deckWithProgress.contentWithProgress ?? [];

  if (!deckID) return <div className="text-center text-red-500">Invalid deck ID</div>;

  if (deckType !== "r" && deckType !== "l")
    return <div className="text-center text-red-500">Invalid link</div>;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleLeft = () => setLeftOpen((prev) => !prev);

  const goToDeck = () => {
    navigate("/deck/" + deckType + "/" + deckID);
  }

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
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleAnswer = (selected: string) => {
    if (showFeedback) return;
    const currentCard = cards[currentQuestionIndex];
    const isCorrect = selected === currentCard.answer;

    setSelectedAnswer(selected);
    setShowFeedback(true);

    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (!isCorrect ? 1 : 0),
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < cards.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizFinished(true);
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

  if (quizFinished) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-6 rounded shadow-md bg-white text-center space-y-4">
          <h1 className="text-3xl font-bold">🎉 Quiz Finished!</h1>
          <p className="text-green-600 font-medium">✅ Correct: {score.correct}</p>
          <p className="text-red-600 font-medium">❌ Incorrect: {score.incorrect}</p>

          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" className="w-35" onClick={goToDeck}>
              Back to Deck
            </Button>
            <Button
              variant="default"
              className="w-35"
              onClick={() => {
                setQuizFinished(false);
                setCurrentQuestionIndex(0);
                setScore({ correct: 0, incorrect: 0 });
                generateQuestion();
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentQuestionIndex];

  const renderQuestion = () => (
    <div className="flex-1 p-6">
      <p className="mb-4 text-sm text-gray-600">
        Question {currentQuestionIndex + 1} of {cards.length}
      </p>
      <div className="mb-6 p-4 bg-gray-100 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold">{currentCard.question}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          let buttonStyle = "border p-3 rounded-lg transition-colors duration-150";

          if (showFeedback) {
            if (option === currentCard.answer) {
              buttonStyle += " bg-green-100 border-green-400 font-semibold";
            } else if (option === selectedAnswer) {
              buttonStyle += " bg-red-100 border-red-400";
            } else {
              buttonStyle += " opacity-60";
            }
          } else {
            buttonStyle += " hover:bg-blue-100";
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={buttonStyle}
              disabled={showFeedback}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-6 text-center">
          <p className={`mb-4 text-lg font-medium ${selectedAnswer === currentCard.answer ? "text-green-600" : "text-red-600"}`}>
            {selectedAnswer === currentCard.answer ? "Correct!" : `Incorrect. The correct answer was: ${currentCard.answer}`}
          </p>
          <Button onClick={handleNextQuestion} className="px-6 py-2">
            Next
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-max-content flex-col">
      <SidebarProvider defaultOpen={!isMobile} open={leftOpen} onOpenChange={setLeftOpen}>
        {isMobile ? (
          <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
            <SheetContent side="left" className="w-[280px] p-0">
              <Sidebar style={{ "--sidebar-width": "280px" } as React.CSSProperties}>
                <LeftSidebar />
              </Sidebar>
            </SheetContent>
          </Sheet>
        ) : (
          <Sidebar variant="inset" className="border-r h-full">
            <LeftSidebar />
          </Sidebar>
        )}
        <SidebarInset className="flex-1 h-max-content">
          <div className="flex flex-col w-full h-max-content relative">
            <header className="flex h-20 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleLeft}>
                  <Menu className="h-6 w-6 scale-175 text-[var(--accent2)]" />
                  <span className="sr-only">Toggle left sidebar</span>
                </Button>
              </div>
              <span className="mb-4 text-2xl font-bold justify-center text-[var(--accent)]">{deck.deckName}</span>
              <Button variant="ghost" onClick={goToDeck}>
                <X className="h-6 w-6 scale-175 text-[var(--accent2)]" />
              </Button>
            </header>
          </div>
          <main className="flex-1 p-4 space-y-4">{renderQuestion()}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default QuizPage;
