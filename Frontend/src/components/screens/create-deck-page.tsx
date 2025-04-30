import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LeftSidebar } from "@/components/left-sidebar";
import qclogo2 from "../../assets/qclogo2.png";

const CreateDeckPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [leftOpen, setLeftOpen] = useState(false);
  const [cards, setCards] = useState<{ id: number; front: string; back: string }[]>([]);
  const [deckName, setDeckName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [saveLocal, setSaveLocal] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [isDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleLeft = () => setLeftOpen((prev) => !prev);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        const response = await fetch("https://quizclone.com/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Verification failed");
        }

        const data = await response.json();
        setUsername(data.username);
        setSaveLocal(false);
      } catch (error) {
        console.warn("User not logged in or verification failed. Defaulting to local save.");
        localStorage.removeItem("username");
        setUsername(null);
        setSaveLocal(true);
      } finally {
        setCheckingLogin(false);
      }
    };

    verifyLogin();
  }, []);

  // Handle window resize for mobile view.
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const addCard = () => {
    setCards((prevCards) => [
      ...prevCards,
      { id: Date.now(), front: "", back: "" },
    ]);
  };

  const deleteCard = (id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const updateCard = (id: number, field: "front" | "back", value: string) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const saveDeck = async () => {
    if (!deckName) {
      alert("Please provide a name for the deck.");
      return;
    }

    if (cards.length === 0) {
      alert("Please add at least one card to the deck.");
      return;
    }

    const hasEmptyCard = cards.some(card => !card.front.trim() || !card.back.trim());
    if (hasEmptyCard) {
      alert("All cards must have a front and back.");
      return;
    }


    if (saveLocal || !username) {
      const UUID = randomUUID();
      const localDeck = {
        deckID: UUID,
        deckName,
        ownerID: "-1",
        ownerName: "local study deck",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        content: cards.map((card, index) => ({
          cardID: index,
          question: card.front,
          answer: card.back,
          totalAttempts: 0,
          totalCorrect: 0,
        })),
        public: false,
        starred: false,
        lastOpened: new Date().toISOString(),
        local: true,
      }
      const existing = JSON.parse(localStorage.getItem("studyDecks") || "[]");
      existing.push(localDeck);
      localStorage.setItem("studyDecks", JSON.stringify(existing));


      alert("Deck saved locally!");
      setDeckName("");
      setCards([]);
      navigate("/deck/l/" + UUID);
      return;
    }

    try {
      const deck = {
        deckName,
        isPublic,
        content: cards.map((card, index) => ({
          cardID: index,
          question: card.front,
          answer: card.back,
        })),
      };

      const response = await fetch("https://quizclone.com/api/deck/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deck),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save deck to cloud");
      }

      const data = await response.json();
      const createdDeckID = data.deckID;
      setDeckName("");
      setCards([]);
      navigate("/deck/r/" + createdDeckID);
    } catch (error) {
      console.error("Error saving deck:", error);
      alert("Failed to save the deck. Please try again.");
    }
  };

  const goToMain = () => {
    navigate("/");
  };

  const handleSaveLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaveLocal(e.target.checked);

    if (isPublic) {
      setIsPublic(false);
    }
  }

  console.log(username)

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
            <header className="sticky top-0 z-10 bg-[var(--background)] flex h-20 items-center justify-between px-6 border-b border-border">
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
                Create Deck
              </span>
              <Button variant="ghost" onClick={goToMain}>
                <X className="h-10 w-10 scale-175 text-purple-800 dark:text-purple-400" />
              </Button>
            </header>

            <main className="flex-1 p-4 space-y-4">
              <input
                type="text"
                placeholder="Deck Name"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                className="border border-[var(--accent2)] focus:border-[var(--accent3)] focus:outline-none bg-[var(--input-background)] text-[var(--foreground)] p-2 rounded-md w-full"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isPublic && username !== null}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    disabled={saveLocal}
                  />
                  <span className="text-[var(--foreground)]">Make Deck Public</span>
                </label>

                {username ? (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={saveLocal}
                      onChange={(e) => handleSaveLocalChange(e)}
                    />
                    <span className="text-[var(--foreground)]">Save Locally</span>
                  </label>
                ) : (
                  <span className="text-[var(--muted-foreground)] italic">
                    Saving locally (not logged in)
                  </span>
                )}
              </div>

              <div className="flex flex-col space-y-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="border rounded-lg p-4 shadow-md flex flex-col space-y-4 bg-[var(--background)] text-[var(--foreground)]"
                  >
                    <div className="flex items-stretch space-x-4">
                      <textarea
                        placeholder="Front (Question)"
                        value={card.front}
                        onChange={(e) => updateCard(card.id, "front", e.target.value)}
                        className="border border-[var(--accent2)] focus:border-[var(--accent3)] focus:outline-none bg-[var(--input-background)] text-[var(--foreground)] h-30 p-2 rounded-md w-1/2 resize-none"
                        rows={1}
                      />

                      <textarea
                        placeholder="Back (Answer)"
                        value={card.back}
                        onChange={(e) => updateCard(card.id, "back", e.target.value)}
                        className="border border-[var(--accent2)] focus:border-[var(--accent3)] focus:outline-none bg-[var(--input-background)] text-[var(--foreground)] p-2 rounded-md w-1/2 resize-none"
                        rows={1}
                      />
                    </div>

                    <Button
                      onClick={() => deleteCard(card.id)}
                      className=" max-h-[50px] min-w-[50px] max-w-[100px] py-2 text-sm sm:text-base cursor-pointer border border-border text-purple-700 dark:text-purple-300 bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] dark:hover:bg-purple-700 transition-colors self-end"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                {cards.length === 0 && (
                  <p className="text-center text-[var(--muted-foreground)]">No cards added yet.</p>
                )}

                {/* Add card button centered and below all cards */}
                <div className="flex justify-center pt-2">
                  <Button className="flex-1 min-w-[100px] max-w-[150px] py-2 text-sm sm:text-base cursor-pointer border border-border text-purple-700 dark:text-purple-300 bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] dark:hover:bg-purple-700 transition-colors" onClick={addCard}>
                    Add Card
                  </Button>
                </div>
              </div>
            </main>

            {/* Save Deck button at bottom right */}
            <div className="flex justify-end p-4 border-t">
              <Button
                onClick={saveDeck}
                disabled={checkingLogin}
                className="flex-1 min-w-[100px] max-w-[150px] py-2 text-sm sm:text-base cursor-pointer border border-border bg-[var(--accent2)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] dark:hover:bg-purple-700  transition-colors text-black"
              >
                {checkingLogin ? "Checking..." : "Save Deck"}
              </Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );

};

function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default CreateDeckPage;
