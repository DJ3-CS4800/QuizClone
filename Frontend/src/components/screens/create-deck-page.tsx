import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LeftSidebar } from "@/components/left-sidebar";

const CreateDeckPage = () => {
    const [leftOpen, setLeftOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [cards, setCards] = useState<{ id: number; front: string; back: string }[]>([]);

    React.useEffect(() => {
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
                            </header>
                            <div className="p-4 space-y-4">
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
                        </main>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
};

export default CreateDeckPage;