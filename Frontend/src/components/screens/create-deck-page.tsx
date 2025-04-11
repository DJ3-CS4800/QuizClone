import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LeftSidebar } from "@/components/left-sidebar";

const CreateDeckPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [leftOpen, setLeftOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cards, setCards] = useState<{ id: number; front: string; back: string }[]>([]);
  const [deckName, setDeckName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [saveLocal, setSaveLocal] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
              <span className="mb-4 text-2xl font-bold justify-center text-[var(--accent)]">Create Deck</span>
              <Button variant="ghost" onClick={goToMain}>
                <X className="h-6 w-6 scale-175 text-[var(--accent2)]" />
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
                      variant="outline"
                      onClick={() => deleteCard(card.id)}
                      className="self-end text-[var(--accent)]"
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
                  <Button variant="outline" onClick={addCard}>
                    Add Card
                  </Button>
                </div>
              </div>
            </main>

            {/* Save Deck button at bottom right */}
            <div className="flex justify-end p-4 border-t">
              <Button
                variant="outline"
                onClick={saveDeck}
                disabled={checkingLogin}
                className="w-fit bg-[var(--accent2)] text-[var(--accent-foreground)] hover:bg-[var(--accent)]"
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
