import * as React from "react";
import { Menu, Plus, Star, StarOff, Trash } from "lucide-react";
import { LeftSidebar } from "@/components/left-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarInset, SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

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

// DeckCard component handles the layout of each deck.
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
    <div
      className="relative rounded-lg bg-muted p-4 shadow-md transition hover:brightness-95 w-[250px] h-[220px]"
    >
      {/* Invisible button for full-card click */}
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

      {/* Delete button at top left */}
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
          <Trash className="text-[var(--accent2)]" />
        </Button>
      </div>

      {/* Favorite button at top right */}
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
            <Star className="text-[var(--accent3)]" />
          ) : (
            <StarOff className="text-[var(--accent2)]" />
          )}
        </Button>
      </div>

      {/* Label at bottom left: Local Deck or Owner Name */}
      <div className="absolute bottom-2 left-2 z-10">
        {deck.local ? (
          <p className="text-sm text-[var(--accent2)]">Local Deck</p>
        ) : (
          <p className="text-sm text-[var(--accent3)]">{deck.ownerName}</p>
        )}
      </div>
    </div>
  );
}

export default function MainPage() {
  const [leftOpen, setLeftOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [decks, setDecks] = React.useState<StudyDeck[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const navigate = useNavigate();

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

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
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

        if (!response.ok)
          throw new Error("Failed to fetch study decks from API");
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

      console.log(allDecks);
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
    const now = new Date().toISOString();

    if (deck.local) {
      const updatedDecks = decks.map((d) =>
        d.deckID === deck.deckID
          ? { ...d, starred: !d.starred, lastOpened: now }
          : d
      );
      setDecks(sortDecks(updatedDecks));
    } else {
      const updateStarredAndLastOpened = async () => {
        try {
          await fetch(
            `https://quizclone.com/api/deckProgress/favorite/${deck.deckID}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
          loadDecks();
          const updatedDecks = decks.map((d) =>
            d.deckID === deck.deckID
              ? { ...d, starred: !d.starred, lastOpened: now }
              : d
          );
          setDecks(sortDecks(updatedDecks));
        } catch (error) {
          console.error("Error updating starred or lastOpened:", error);
        }
      };

      updateStarredAndLastOpened();
    }
  };

  const handleDeleteDeck = async (deckID: string, local: boolean) => {
    if (local) {
      const existingDecks = JSON.parse(localStorage.getItem("studyDecks") || "[]");
      const updatedDecks = existingDecks.filter((deck: any) => deck.deckID !== deckID);
      localStorage.setItem("studyDecks", JSON.stringify(updatedDecks));
      setDecks((prevDecks) => prevDecks.filter((deck) => deck.deckID !== deckID));
      alert("Local deck deleted successfully!");
    } else {
      try {
        const response = await fetch(`https://quizclone.com/api/deck/${deckID}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to delete the deck");
        }
        setDecks((prevDecks) => prevDecks.filter((deck) => deck.deckID !== deckID));
        alert("Deck deleted successfully!");
      } catch (error) {
        console.error("Error deleting deck:", error);
        alert("Failed to delete the deck. Please try again.");
      }
    }
  };

  return (
    <div className="flex h-max-content flex-col">
      <SidebarProvider defaultOpen={!isMobile} open={leftOpen} onOpenChange={setLeftOpen}>
        {isMobile ? (
          <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
            <SheetContent
              side="left"
              className="w-[80vw] min-w-[200px] max-w-[280px] h-full p-0 overflow-auto"
            >
              <Sidebar style={{ "--sidebar-width": "280px", height: "100%" } as React.CSSProperties}>
                <LeftSidebar />
              </Sidebar>
            </SheetContent>
          </Sheet>
        ) : (
          <Sidebar variant="inset" className="border-r h-full">
            <LeftSidebar />
          </Sidebar>
        )}

        <SidebarInset className="flex-1 h-full overflow-hidden">
          <div className="flex w-full h-full">
            <main className="flex-1 h-full">
              <header className="flex h-20 items-center justify-between px-4">
                <Button variant="ghost" size="icon" onClick={toggleLeft}>
                  <Menu className="h-6 w-6 scale-175 text-[var(--accent2)]" />
                  <span className="sr-only">Toggle left sidebar</span>
                </Button>
                <h1 className="mb-4 text-2xl font-bold text-[var(--accent)]">QuizClone</h1>
              </header>

              <div className="p-4 pl-5 pr-5">
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
                        handleDeleteDeck={handleDeleteDeck}
                        handleFavoriteClick={handleFavoriteClick}
                      />
                    ))}
                    <button
                      className="group flex flex-col items-center justify-center rounded-lg bg-[var(--accent2)] text-left transition hover:bg-[var(--accent)] shadow-md w-[250px] h-[220px]"
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
    </div>
  );
}
