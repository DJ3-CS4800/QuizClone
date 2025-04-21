import { useEffect, useState, FormEvent } from "react";
import { Menu, Search, X } from "lucide-react";
import { LeftSidebar } from "@/components/left-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarInset, SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

// Interfaces
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

// Simplified DeckCard component for search results (no delete or favorite)
function DeckCard({
  deck,
  handleDeckClick,
}: {
  deck: StudyDeck;
  handleDeckClick: (deck: StudyDeck) => void;
}) {
  return (
    <div
      className="relative rounded-lg bg-muted p-4 shadow-md transition hover:brightness-95 w-[250px] h-[220px] cursor-pointer"
      onClick={() => handleDeckClick(deck)}
    >
      {/* Centered deck name */}
      <div className="flex items-center justify-center h-full z-10">
        <h2 className="text-center break-words text-lg font-semibold">
          {deck.deckName}
        </h2>
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

// SearchPage component
export default function SearchPage() {
  const [leftOpen, setLeftOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [decks, setDecks] = useState<StudyDeck[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();
  const pageSize = 10; // Adjust page size as needed

  // Toggle left sidebar
  const toggleLeft = () => setLeftOpen((prev) => !prev);

  // Navigate to the deck detail page
  const handleDeckClick = (deck: StudyDeck) => {
    const now = new Date().toISOString();
    // Optionally update lastOpened locally if desired.
    const updatedDecks = decks.map((d) =>
      d.deckID === deck.deckID ? { ...d, lastOpened: now } : d
    );
    setDecks(updatedDecks);
    if (deck.local) {
      navigate(`/deck/l/${deck.deckID}`);
    } else {
      navigate(`/deck/r/${deck.deckID}`);
    }
  };

  // Function to fetch search results from the backend
  const fetchSearchResults = async () => {
    if (!searchQuery.trim()) {
      setDecks([]);
      setTotalPages(0);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `https://quizclone.com/api/deck/search?query=${encodeURIComponent(
          searchQuery
        )}&page=${page}&size=${pageSize}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Search failed.");
      }
      const data = await response.json();
      setDecks(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch search results when page changes or on form submit
  useEffect(() => {
    if (searchQuery.trim()) {
      fetchSearchResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement> | React.MouseEvent) => {
    e.preventDefault();
    setPage(0);
    fetchSearchResults();
  };

  // Pagination controls
  const goToNextPage = () => {
    if (page < totalPages - 1) setPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  // Apply dark theme on mount if needed
  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const handleBackclick = () => {
    navigate("/");
  }

  return (
    <div className="flex h-max-content flex-col">
      <SidebarProvider defaultOpen={false} open={leftOpen} onOpenChange={setLeftOpen}>
        {/* Left sidebar */}
        {leftOpen && (
          <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
            <SheetContent
              side="left"
              className="w-[280px] min-w-[200px] h-full p-0 overflow-auto"
            >
              <Sidebar
                style={{ "--sidebar-width": "280px", height: "100%" } as React.CSSProperties}
              >
                <LeftSidebar />
              </Sidebar>
            </SheetContent>
          </Sheet>
        )}
        <SidebarInset className="flex-1 h-full overflow-hidden">
          <div className="flex w-full h-full">
            <main className="flex-1 h-full">
              <header className="flex h-20 items-center justify-between px-4">
                <Button variant="ghost" size="icon" onClick={toggleLeft}>
                  <Menu className="h-6 w-6 scale-175 text-[var(--accent2)]" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
                <span className="mb-4 text-2xl font-bold justify-center text-[var(--accent)]">Search</span>
                <Button variant="ghost" onClick={handleBackclick}>
                  <X className="h-6 w-6 scale-175 text-[var(--accent2)]" />
                </Button>
              </header>
              <div className="p-4">
                {/* Updated search form with embedded search icon */}
                <form
                  className="mx-auto mb-6 max-w-md"
                  onSubmit={handleSearchSubmit}
                >
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full rounded-md border border-[var(--accent2)] focus:border-[var(--accent3)] focus:outline-none bg-background px-4 py-2 pr-10 "
                      placeholder="Search public decks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-[var(--accent)]"
                      onClick={handleSearchSubmit}
                    >
                      <Search className="h-5 w-5" />
                    </div>
                  </div>
                </form>

                {loading ? (
                  <p className="text-center text-[var(--accent)]">Loading decks...</p>
                ) : decks.length > 0 ? (
                  <>
                    <div
                      className="grid gap-[10px] justify-start items-start"
                      style={{ gridTemplateColumns: "repeat(auto-fit, 250px)" }}
                    >
                      {decks.map((deck) => (
                        <DeckCard
                          key={deck.deckID}
                          deck={deck}
                          handleDeckClick={handleDeckClick}
                        />
                      ))}
                    </div>
                    {/* Pagination controls */}
                    <div className="mt-6 flex justify-center items-center gap-4">
                      <Button className="flex-1 min-w-[100px] max-w-[150px] py-2 text-sm sm:text-base cursor-pointer border border-border text-[var(--accent)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors" onClick={goToPrevPage} disabled={page === 0}>
                        Previous
                      </Button>
                      <span className="text-sm sm:text-base text-[var(--accent)]">
                        Page {page + 1} of {totalPages}
                      </span>
                      <Button className="flex-1 min-w-[100px] max-w-[150px] py-2 text-sm sm:text-base cursor-pointer border border-border text-[var(--accent)] bg-transparent hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors" onClick={goToNextPage} disabled={page >= totalPages - 1}>
                        Next
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-[var(--accent)] ">No decks found.</p>
                )}
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
