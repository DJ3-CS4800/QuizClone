import { useEffect, useState } from "react";
import { Menu, Plus, Star, StarOff, Trash } from "lucide-react";
import { LeftSidebar } from "@/components/left-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarInset, SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import qclogo from "../../assets/qclogo2.png";


interface Flashcard {
  cardID: number;
  question: string;
  answer: string;
}

interface StudyDeck {
  deckID: string;
  deckName: string;
  ownerID: string;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  content: Flashcard[];
  public: boolean;
  starred?: boolean;
  lastOpened?: string;
  local: boolean;
}

// A separate component for each deck card.
function DeckCard({
  deck,
  handleDeckClick,
  handleDeleteDeck,
  handleFavoriteClick,
}: {
  deck: StudyDeck;
  handleDeckClick: (deck: StudyDeck) => void;
  handleDeleteDeck: (deckID: string, local: boolean) => void;
  handleFavoriteClick: (deck: StudyDeck) => void;
}) {
  return (
    <div className="relative rounded-lg bg-purple-100 dark:bg-muted p-4 shadow-md transition hover:brightness-95 w-[250px] h-[220px]">
      {/* Invisible full-card button for navigation */}
      <button
        onClick={() => handleDeckClick(deck)}
        className="absolute inset-0 z-0"
        aria-label={`Open ${deck.deckName}`}
      />

      {/* Centered deck name with wrapping */}
      <div className="flex items-center justify-center h-full z-10">
        <h2 className="text-center break-words text-lg font-semibold">
          {deck.deckName}
        </h2>
      </div>

      {/* Delete button at top left with hover effect and confirmation */}
      <div className="absolute top-2 left-2 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-colors duration-200 hover:bg-red-200"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteDeck(deck.deckID, deck.local);
          }}
          aria-label="Delete Deck"
        >
          <Trash className="h-5 w-5 text-red-800 dark:text-red-400" />
        </Button>
      </div>

      {/* Favorite button at top right with hover effect */}
      <div className="absolute top-2 right-2 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-colors duration-200 hover:bg-yellow-200"
          onClick={(e) => {
            e.stopPropagation();
            handleFavoriteClick(deck);
          }}
          aria-label="Favorite Deck"
        >
          {deck.starred ? (
            <Star className="h-10 w-10 text-yellow-600 dark:text-yellow-400 fill-current" />
          ) : (
            <StarOff className="h-10 w-10 text-gray-600 dark:text-gray-300" />
          )}
        </Button>
      </div>

      {/* Label at bottom left: Local Deck or Owner Name */}
      <div className="absolute bottom-2 left-2 z-10">
        {deck.local ? (
          <p className="text-sm text-purple-800 dark:text-purple-300">Local Deck</p>
        ) : (
          <p className="text-sm text-purple-800 dark:text-purple-300">{deck.ownerName}</p>
        )}
      </div>
    </div>
  );
}


// MainPage component that uses the DeckCard component to display a list of decks.
export default function MainPage() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [decks, setDecks] = useState<StudyDeck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aboutToDelete, setAboutToDelete] = useState({ deckID: "", local: false });
  const [isDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();

  // Sort decks by starred flag and then by lastOpened date descending.
  const sortDecks = (unsorted: StudyDeck[]) => {
    return [...unsorted].sort((a, b) => {
      if ((b.starred ? 1 : 0) !== (a.starred ? 1 : 0)) {
        return (b.starred ? 1 : 0) - (a.starred ? 1 : 0);
      }
      const aTime = a.lastOpened ? new Date(a.lastOpened).getTime() : 0;
      const bTime = b.lastOpened ? new Date(b.lastOpened).getTime() : 0;
      return bTime - aTime;
    });
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    loadDecks();
  }, []);

  const loadDecks = async () => {
    setLoading(true);
    try {
      const username = localStorage.getItem("username");
      const localData = localStorage.getItem("studyDecks");
      let allDecks: StudyDeck[] = [];

      if (localData) {
        const parsed = JSON.parse(localData);
        allDecks = [...parsed];
      }

      if (username) {
        const response = await fetch(`https://quizclone.com/api/deck/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch study decks from API");
        const data: { studyDeckList: any[] } = await response.json();
        const mappedDecks: StudyDeck[] = data.studyDeckList.map((deck) => ({
          deckID: deck.deck_id,
          deckName: deck.deck_name,
          ownerID: deck.owner_id,
          ownerName: deck.owner_name,
          createdAt: deck.created_at,
          updatedAt: deck.updated_at,
          content: [],
          public: deck.is_public,
          starred: deck.is_favorite,
          lastOpened: deck.last_opened,
          local: false,
        }));
        allDecks = [...allDecks, ...mappedDecks];
      }

      setDecks(sortDecks(allDecks));
    } catch (error) {
      console.error("Error loading decks:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLeft = () => setLeftOpen((prev) => !prev);

  const handleDeckClick = (deck: StudyDeck) => {
    const now = new Date().toISOString();
    const updatedDecks = decks.map((d) =>
      d.deckID === deck.deckID ? { ...d, lastOpened: now } : d
    );
    setDecks(sortDecks(updatedDecks));
    if (deck.local) {
      navigate(`/deck/l/${deck.deckID}`);
    } else {
      navigate(`/deck/r/${deck.deckID}`);
    }
  };

  const handleFavoriteClick = (deck: StudyDeck) => {
    if (deck.local) {
      const updatedDecks = decks.map((d) =>
        d.deckID === deck.deckID
          ? { ...d, starred: !d.starred }
          : d
      );
      setDecks(sortDecks(updatedDecks));
      const existing = JSON.parse(localStorage.getItem("studyDecks") || "[]");
      const updated = existing.map((d: StudyDeck) =>
        d.deckID === deck.deckID
          ? { ...d, starred: !d.starred }
          : d
      );
      localStorage.setItem("studyDecks", JSON.stringify(updated));
    } else {
      (async () => {
        try {
          await fetch(`https://quizclone.com/api/deckProgress/favorite/${deck.deckID}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          const updatedDecks = decks.map((d) =>
            d.deckID === deck.deckID
              ? { ...d, starred: !d.starred }
              : d
          );
          setDecks(sortDecks(updatedDecks));

        } catch (error) {
          console.error("Error updating starred or lastOpened:", error);
        }
      })();
    }
  };

  const handleDeleteClick = (deckID: string, local: boolean) => {
    setAboutToDelete({ deckID: deckID, local: local });
    setIsDialogOpen(true);
  }

  const handleCancelDeleteDeck = () => {
    setAboutToDelete({ deckID: "", local: false });
    setIsDialogOpen(false);
  };

  const handleConfirmDeleteDeck = async (deckID: string, local: boolean) => {
    if (!deckID) return;
    if (local) {
      const existing = JSON.parse(localStorage.getItem("studyDecks") || "[]");
      const updated = existing.filter((deck: any) => deck.deckID !== deckID);
      localStorage.setItem("studyDecks", JSON.stringify(updated));
      setDecks((prev) => prev.filter((deck) => deck.deckID !== deckID));
      setIsDialogOpen(false);
    } else {
      try {
        const response = await fetch(`https://quizclone.com/api/deck/${deckID}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to delete the deck");
        setDecks((prev) => prev.filter((deck) => deck.deckID !== deckID));
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Error deleting deck:", error);
        alert("Failed to delete the deck. Please try again.");
      }
    }
  };

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

        <SidebarInset className="flex-1 h-full overflow-hidden">
          <div className="flex w-full h-full">
            <main className="flex-1 h-full">
              <header className="flex h-20 items-center justify-between px-8">
                <div className="flex items-center gap-3">
                  {/* Sidebar Button */}
                  <Button variant="ghost" size="icon" onClick={toggleLeft}>
                    <Menu className="h-10 w-10 scale-175 text-purple-800 dark:text-purple-400" /> {/* Increased size */}
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                  {/* Logo Image */}
                  <img
                    src={qclogo}
                    alt="Logo"
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <span className="mb-4 text-3xl font-bold justify-center text-purple-400 dark:text-purple-400">QuizClone</span>
                <div></div>
              </header>
              <div className="p-6 pl-8 pr-5">
                {loading ? (
                  <p>Loading decks...</p>
                ) : (
                  <div
                    className="grid gap-[10px] justify-start items-start"
                    style={{ gridTemplateColumns: "repeat(auto-fit, 250px)" }}
                  >
                    {decks.map((deck) => (
                      <DeckCard
                        key={deck.deckID}
                        deck={deck}
                        handleDeckClick={handleDeckClick}
                        handleDeleteDeck={() => handleDeleteClick(deck.deckID, deck.local)}
                        handleFavoriteClick={handleFavoriteClick}
                      />
                    ))}
                    <button
                      className="group flex flex-col items-center justify-center rounded-lg bg-purple-300 dark:bg-purple-800 text-left transition hover:bg-purple-300 dark:hover:bg-purple-700 shadow-md w-[250px] h-[220px]"
                      onClick={() => navigate("/create-deck")}
                    >
                      <Plus className="h-8 w-8 mb-2" />
                      <h2 className="text-lg font-semibold">Create New Deck</h2>
                    </button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Are you sure you want to delete this deck?</DialogTitle>
          <DialogDescription>
            You will not be able to recover the deck after deletion.
          </DialogDescription>
          <div className="flex justify-end gap-2">
            <DialogFooter>
              <Button className="flex-1 min-w-[100px] max-w-[150px] py-2 text-sm sm:text-base cursor-pointer border border-border text-[var(--accent)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors" onClick={handleCancelDeleteDeck}>
                Cancel
              </Button>
            </DialogFooter>
            <DialogFooter>
              <Button
                className="flex-1 min-w-[100px] max-w-[150px] py-2 text-sm sm:text-base cursor-pointer border border-border text-red-600 bg-transparent hover:bg-[var(--accent)] hover:text-red-700 transition-colors"
                onClick={() => handleConfirmDeleteDeck(aboutToDelete.deckID, aboutToDelete.local)}
              >
                Delete
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
