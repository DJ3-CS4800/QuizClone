import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LeftSidebar } from "@/components/left-sidebar";
import qclogo2 from "../../assets/qclogo2.png";


interface Card {
  id: number;
  front: string;
  back: string;
}

const EditDeckPage = () => {
  const navigate = useNavigate();
  const { deckID, deckType } = useParams<{ deckID: string; deckType: string }>();
  const [deckName, setDeckName] = useState("");
  const [originalDeckName, setOriginalDeckName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [originalIsPublic, setOriginalIsPublic] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);
  const [originalCards, setOriginalCards] = useState<Card[]>([]);
  const [cardCounter, setCardCounter] = useState(0);
  const [leftOpen, setLeftOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        if (deckType === "l") {
          const localData = localStorage.getItem("studyDecks");
          if (!localData) throw new Error("No local decks found");

          const localDecks = JSON.parse(localData);
          const foundDeck = localDecks.find((d: any) => d.deckID === deckID);
          if (!foundDeck) throw new Error("Local deck not found");

          setDeckName(foundDeck.deckName);
          setOriginalDeckName(foundDeck.deckName);
          setIsPublic(foundDeck.isPublic);
          setOriginalIsPublic(foundDeck.isPublic);
          const formattedCards = foundDeck.content.map((card: any, index: number) => ({
            id: index,
            front: card.question,
            back: card.answer,
          }));
          setCards(formattedCards);
          setOriginalCards(formattedCards);
          setCardCounter(formattedCards.length);
        } else if (deckType === "r") {
          const response = await fetch(`https://quizclone.com/api/deck/${deckID}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!response.ok) throw new Error("Failed to fetch remote deck");

          const data = await response.json();
          if (!data.isOwner) throw new Error("You are not authorized to edit this deck");

          setDeckName(data.deckName);
          setOriginalDeckName(data.deckName);
          setIsPublic(data.isPublic);
          setOriginalIsPublic(data.isPublic);
          const formattedCards = data.deckWithProgress.contentWithProgress.map((card: any, index: number) => ({
            id: card.cardID ?? index,
            front: card.question,
            back: card.answer,
          }));
          setCards(formattedCards);
          setOriginalCards(formattedCards);
          setCardCounter(formattedCards.length);
        } else {
          throw new Error("Invalid deck type");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [deckID, deckType]);

  // Handle window resize for mobile view.
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const updateCard = (id: number, field: "front" | "back", value: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );
  };

  const addCard = () => {
    setCards((prev) => [...prev, { id: cardCounter, front: "", back: "" }]);
    setCardCounter((prev) => prev + 1);
  };

  const deleteCard = (id: number) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const hasChanges = () => {
    if (deckName !== originalDeckName || isPublic !== originalIsPublic) return true;
    if (cards.length !== originalCards.length) return true;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].front !== originalCards[i]?.front || cards[i].back !== originalCards[i]?.back) return true;
    }
    return false;
  };

  const saveDeck = async () => {
    if (!hasChanges()) {
      alert("No changes made to the deck.");
      return;
    }

    if (!deckName || cards.length === 0 || cards.some((c) => !c.front.trim() || !c.back.trim())) {
      alert("Please complete all fields before saving.");
      return;
    }

    const updatedDeck = {
      deckName,
      isPublic,
      content: cards.map((card, index) => ({
        cardID: index,
        question: card.front,
        answer: card.back,
      })),
    };

    if (deckType === "l") {
      const localData = JSON.parse(localStorage.getItem("studyDecks") || "[]");
      const updatedDecks = localData.map((deck: any) =>
        deck.deckID === deckID ? { ...deck, ...updatedDeck, updatedAt: new Date().toISOString() } : deck
      );
      localStorage.setItem("studyDecks", JSON.stringify(updatedDecks));
      alert("Local deck updated!");
      navigate(`/deck/l/${deckID}`);
    } else {
      const response = await fetch(`https://quizclone.com/api/deck/${deckID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedDeck),
      });

      if (!response.ok) return alert("Failed to update deck");
      alert("Deck updated!");
      navigate(`/deck/r/${deckID}`);
    }
  };

  const toggleLeft = () => setLeftOpen((prev) => !prev);

  const handleBackclick = () => {
    navigate(`/deck/${deckType}/${deckID}`);
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 text-lg p-8">{error}</div>;

  return (
    <div className="flex h-max-content flex-col">
      <SidebarProvider defaultOpen={false} open={leftOpen} onOpenChange={setLeftOpen}>
        {leftOpen && (
          <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
            <SheetContent
              side="left"
              className="h-full overflow-auto p-0"
              style={{
                width: isMobile ? '100%' : '280px',
                minWidth: isMobile ? '100%' : '200px',
                height: "100%",
              }}
            >
              {isMobile ? (
                <div className="flex flex-col w-full h-full overflow-y-auto">
                  <LeftSidebar />
                </div>
              ) : (
                <Sidebar style={{ "--sidebar-width": "280px", height: "100%" } as React.CSSProperties}>
                  <LeftSidebar />
                </Sidebar>
              )}
            </SheetContent>
          </Sheet>
        )}

        <SidebarInset className="flex-1 h-max-content">
          <div className="flex flex-col w-full h-max-content relative">
            <header className="sticky top-0 z-10 bg-[var(--background)] flex h-20 items-center justify-between px-6">
              <div className="flex items-center gap-3">
                {/* Sidebar Button */}
                <Button variant="ghost" size="icon" onClick={toggleLeft}>
                  <Menu className="h-10 w-10 scale-175 text-purple-800 dark:text-purple-400" />
                  <span className="sr-only">Toggle left sidebar</span>
                </Button>
                {/* Logo Image */}
                <img
                  src={qclogo2}
                  alt="Logo"
                  onClick={() => navigate("/")}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <span className="mb-4 text-3xl font-bold justify-center text-purple-400 dark:text-purple-400">
                Edit Deck
              </span>
              <Button variant="ghost" onClick={handleBackclick}>
                <X className="h-10 w-10 scale-175 text-purple-800 dark:text-purple-400" />
              </Button>
            </header>

            <main className="flex-1 p-4 space-y-4">
              <input
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="Deck Name"
                className="border border-[var(--accent2)] focus:border-[var(--accent3)] focus:outline-none bg-[var(--input-background)] text-[var(--foreground)] p-2 rounded-md w-full"
              />

              <div className="flex items-center justify-between">
                {deckType === "r" && (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    <span className="text-[var(--foreground)]">Make deck public</span>
                  </label>
                )}
              </div>

              <div className="flex flex-col space-y-4">
                {cards.map((card) => (
                  <div key={card.id} className="border rounded-lg p-4 shadow-md flex flex-col space-y-4 bg-[var(--background)] text-[var(--foreground)]">
                    <div className="flex items-stretch space-x-4">
                      <textarea
                        value={card.front}
                        onChange={(e) => updateCard(card.id, "front", e.target.value)}
                        placeholder="Front (question)"
                        className="border border-[var(--accent2)] focus:border-[var(--accent3)] focus:outline-none bg-[var(--input-background)] text-[var(--foreground)] h-30 p-2 rounded-md w-1/2 resize-none"
                        rows={1}
                      />
                      <textarea
                        value={card.back}
                        onChange={(e) => updateCard(card.id, "back", e.target.value)}
                        placeholder="Back (answer)"
                        className="border border-[var(--accent2)] focus:border-[var(--accent3)] focus:outline-none bg-[var(--input-background)] text-[var(--foreground)] p-2 rounded-md w-1/2 resize-none"
                        rows={1}
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => deleteCard(card.id)}
                      className="self-end text-purple-700 dark:text-purple-300 hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] dark:hover:bg-purple-700"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                {cards.length === 0 && (
                  <p className="text-center text-[var(--muted-foreground)]">No cards added yet.</p>
                )}
                <div className="flex justify-center pt-2">
                  <Button className="flex-1 min-w-[100px] max-w-[150px] py-2 text-sm sm:text-base cursor-pointer border border-border text-purple-700 dark:text-purple-300 bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] dark:hover:bg-purple-700 transition-colors" onClick={addCard}>
                    Add Card
                  </Button>
                </div>
              </div>
            </main>

            <div className="flex justify-end p-4 border-t">
              <Button
                onClick={saveDeck}
                disabled={!hasChanges()}
                className="flex-1 min-w-[100px] max-w-[150px] py-2 text-sm sm:text-base cursor-pointer border border-border bg-[var(--accent2)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] dark:hover:bg-purple-700  transition-colors text-black"
              >
                Save Deck
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default EditDeckPage;
