import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LeftSidebar } from "@/components/left-sidebar";

const CreateDeckPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState<string | null>(null); // Logged-in user's username
    const [leftOpen, setLeftOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [cards, setCards] = useState<{ id: number; front: string; back: string }[]>([]);
    const [deckName, setDeckName] = useState(""); // Deck name
    const [isPublic, setIsPublic] = useState(true); // Deck visibility (public/private)

    // Check if the user is logged in
    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (!storedUsername) {
            console.warn("No username found in localStorage. Redirecting to login.");
            navigate("/login");
        } else {
            setUsername(storedUsername);
        }
    }, [navigate]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const toggleLeft = () => setLeftOpen((prev) => !prev);

    const addCard = () => {
        setCards((prevCards) => [
            ...prevCards,
            { id: Date.now(), front: "", back: "" }, // Add a new card with unique ID
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

        const deck = {
            deckName,
            isPublic,
            content: cards.map((card) => ({
                question: card.front,
                answer: card.back,
            })),
            username, // Associate the deck with the logged-in user
        };

        try {
            const response = await fetch("https://quizclone.com/api/deck/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deck),
            });

            if (!response.ok) {
                throw new Error("Failed to save deck");
            }

            const data = await response.json(); // Get the saved deck data (including deckID)
            console.log("Deck saved successfully:", data);

            alert("Deck saved successfully!");
            setDeckName(""); // Reset deck name
            setCards([]); // Clear cards
        } catch (error) {
            console.error("Error saving deck:", error);
            alert("Failed to save the deck. Please try again.");
        }
    };

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
                    <div className="flex w-full h-max-content">
                        <main className="flex-1 h-max-content">
                            <header className="flex h-30 items-center justify-between px-4">
                                <Button variant="ghost" size="icon" onClick={toggleLeft}>
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle left sidebar</span>
                                </Button>
                                <Button variant="default" onClick={addCard}>
                                    Add Card
                                </Button>
                                <Button variant="default" onClick={saveDeck}>
                                    Save Deck
                                </Button>
                            </header>
                            <div className="p-4">
                                <input
                                    type="text"
                                    placeholder="Deck Name"
                                    value={deckName}
                                    onChange={(e) => setDeckName(e.target.value)}
                                    className="border p-2 rounded-md w-full mb-4"
                                />
                                <label className="flex items-center space-x-2 mb-4">
                                    <input
                                        type="checkbox"
                                        checked={isPublic}
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                    />
                                    <span>Make Deck Public</span>
                                </label>
                                <div className="space-y-4">
                                    {cards.map((card) => (
                                        <div
                                            key={card.id}
                                            className="border rounded-lg p-4 shadow-md flex flex-col space-y-2"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Front of the card"
                                                value={card.front}
                                                onChange={(e) => updateCard(card.id, "front", e.target.value)}
                                                className="border p-2 rounded-md w-full"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Back of the card"
                                                value={card.back}
                                                onChange={(e) => updateCard(card.id, "back", e.target.value)}
                                                className="border p-2 rounded-md w-full"
                                            />
                                            <Button
                                                variant="destructive"
                                                onClick={() => deleteCard(card.id)}
                                                className="self-end"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    ))}
                                    {cards.length === 0 && (
                                        <p className="text-center text-gray-500">No cards added yet.</p>
                                    )}
                                </div>
                            </div>
                        </main>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default CreateDeckPage;