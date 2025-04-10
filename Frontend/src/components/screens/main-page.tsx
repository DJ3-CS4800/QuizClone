import * as React from "react"
import { Menu, Plus, Star, StarOff } from "lucide-react"
import { LeftSidebar } from "@/components/left-sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { SidebarInset, SidebarProvider, Sidebar } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom" // Import useNavigate

interface Flashcard {
    cardID: number
    question: string
    answer: string
}

interface StudyDeck {
    deckID: string
    deckName: string
    ownerID: string
    ownerName: string
    createdAt: string
    updatedAt: string
    content: Flashcard[]
    public: boolean
    starred?: boolean
    lastOpened?: string
    local?: boolean
}

export default function MainPage() {
    const [leftOpen, setLeftOpen] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false)
    const [decks, setDecks] = React.useState<StudyDeck[]>([])
    const [loading, setLoading] = React.useState<boolean>(true)
    const navigate = useNavigate() // Initialize useNavigate

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])


    React.useEffect(() => {
        const loadDecks = async () => {
            setLoading(true)
            try {
                const username = localStorage.getItem("username");

                // Load local decks first
                const localData = localStorage.getItem("studyDecks")
                if (localData) {
                    setDecks(JSON.parse(localData))
                    console.log("Loaded local decks.")
                }

                if (username) {
                    // Fetch API decks if user is logged in
                    const response = await fetch(`https://quizclone.com/api/deck/all`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                        })

                    if (!response.ok) throw new Error("Failed to fetch study decks from API")
                    const data: { studyDeckList: any[] } = await response.json()

                    const mappedDecks: StudyDeck[] = data.studyDeckList.map(deck => ({
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
                    }))

                    setDecks((prevDecks) => [...prevDecks, ...mappedDecks])
                }

            } catch (error) {
                console.error("Error loading decks:", error)
            } finally {
                setLoading(false)
            }
        }

        loadDecks()
    }, [])


    const toggleStar = (deck: StudyDeck) => {
        if (deck.local) {
            const updatedDecks = decks.map(d =>
                d.deckID === deck.deckID ? { ...d, starred: !d.starred } : d
            );

            // Move the favorited deck to the beginning if starred is true
            const reorderedDecks = updatedDecks.sort((a, b) => {
                if (a.starred === b.starred) return 0;
                return a.starred ? -1 : 1;
            });

            setDecks(reorderedDecks);
            localStorage.setItem("studyDecks", JSON.stringify(reorderedDecks));
        } else {
            const updateStarred = async () => {
                try {
                    const response = await fetch(`https://quizclone.com/api/deckProgress/favorite/${deck.deckID}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    });

                    if (!response.ok) throw new Error("Failed to update starred status");

                    const updatedDecks = decks.map(d =>
                        d.deckID === deck.deckID ? { ...d, starred: !d.starred } : d
                    );

                    // Move the favorited deck to the beginning if starred is true
                    const reorderedDecks = updatedDecks.sort((a, b) => {
                        if (a.starred === b.starred) return 0;
                        return a.starred ? -1 : 1;
                    });

                    setDecks(reorderedDecks);
                } catch (error) {
                    console.error("Error updating starred status:", error);
                }
            };
            updateStarred();
        }
    };

    const handleDeleteDeck = async (deckID: string) => {
        try {
            const response = await fetch(`https://quizclone.com/api/deck/${deckID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to delete the deck");
            }

            // Remove the deleted deck from the state
            setDecks((prevDecks) => prevDecks.filter((deck) => deck.deckID !== deckID));
            alert("Deck deleted successfully!");
        } catch (error) {
            console.error("Error deleting deck:", error);
            alert("Failed to delete the deck. Please try again.");
        }
    };


    const toggleLeft = () => setLeftOpen((prev) => !prev)


    const handleDeckClick = (deck: StudyDeck) => {
        if (deck.local) {
            navigate(`/deck/local/${deck.deckID}`)
        } else {
            navigate(`/deck/${deck.deckID}`)
        }
    }

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

                <SidebarInset className="flex-1 h-full">
                    <div className="flex w-full h-full">
                        <main className="flex-1 h-full">
                            <header className="flex h-20 items-center justify-between px-4">
                                <Button variant="ghost" size="icon" onClick={toggleLeft}>
                                    <Menu className="h-6 w-6 text-[var(--accent)]" />
                                    <span className="sr-only">Toggle left sidebar</span>
                                </Button>
                            </header>
                            <div className="p-4 pl-5 pr-5">
                                <h1 className="mb-4 text-4xl font-bold pb-5 text-[var(--accent)]">QuizClone</h1>
                                <h1 className="mb-4 text-2xl font-bold">Study Decks</h1>

                                {loading ? (
                                    <p>Loading decks...</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {decks.map((deck) => (
                                            <div key={deck.deckID} className="relative">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 left-2"
                                                    onClick={() => handleDeleteDeck(deck.deckID)}
                                                >
                                                    <span className="sr-only">Delete Deck</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5 text-red-500 hover:text-red-700"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h14a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm2 4a1 1 0 00-1 1v7a1 1 0 102 0V7a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v7a1 1 0 102 0V7a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </Button>
                                                <button
                                                    className="group rounded-lg bg-muted p-4 text-left transition hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] w-full"
                                                    onClick={() => handleDeckClick(deck)}
                                                >
                                                    <h2 className="mb-2 text-lg font-semibold">{deck.deckName}</h2>
                                                    <p>Created by {deck.ownerName}</p>
                                                </button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => toggleStar(deck)}
                                                >
                                                    {deck.starred ? (
                                                        <Star className="text-[var(--accent3)]" />
                                                    ) : (
                                                        <StarOff className="text-[var(--accent2)]" />
                                                    )}
                                                </Button>
                                            </div>
                                        ))}
                                        <button
                                            className="group flex flex-col items-center justify-center rounded-lg bg-[var(--accent2)] text-left transition hover:bg-[var(--accent)] w-full shadow-md h-23"
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
    )
}