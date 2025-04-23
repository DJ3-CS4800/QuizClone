import { useParams, useNavigate } from "react-router-dom";
import StudyDeck from "../study-deck"; // Import the study deck component
import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LeftSidebar } from "@/components/left-sidebar";
import qclogo2 from "../../assets/qclogo2.png";

const DeckPage = () => {
  const { deckID } = useParams<{ deckID: string }>();
  const { deckType } = useParams<{ deckType: string }>();
  const navigate = useNavigate();
  const [leftOpen, setLeftOpen] = React.useState(false);
  const [isDarkMode] = React.useState(localStorage.getItem("theme") === "dark");


  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  if (!deckID) return <div className="text-center text-red-500">Invalid deck ID</div>;

  if (deckType !== "r" && deckType !== "l")
    return <div className="text-center text-red-500">Invalid link</div>;

  const toggleLeft = () => setLeftOpen((prev) => !prev);

  const goToMain = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen flex-col">
      <SidebarProvider defaultOpen={false} open={leftOpen} onOpenChange={setLeftOpen}>
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

        <SidebarInset className="flex-1 h-full overflow-auto">
          <div className="flex flex-col w-full h-full">
            <main className="flex-1 h-full overflow-auto">
              <header className="sticky top-0 z-10 bg-[var(--background)] flex h-20 items-center justify-between px-6">
                <div className="flex items-center gap-3">
                  {/* Sidebar Button */}
                  <Button variant="ghost" size="icon" onClick={toggleLeft}>
                    <Menu className="h-10 w-10 scale-175 text-purple-800 dark:text-purple-400" />
                    <span className="sr-only">Toggle sidebar</span>
                  </Button>
                  {/* Logo Image */}
                  <img
                    src={qclogo2}
                    alt="Logo"
                    className="h-10 w-10 object-contain"
                  />
                </div>
                <span className="mb-4 text-3xl font-bold justify-center text-purple-400 dark:text-purple-400">
                  Deck
                </span>
                <Button variant="ghost" onClick={goToMain}>
                  <X className="h-10 w-10 scale-175 text-purple-400 dark:text-purple-400" />
                </Button>
              </header>
              <div className="p-4 sm:p-6 lg:p-8 max-w-full overflow-auto">
                <StudyDeck deckId={deckID} deckType={deckType} />
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DeckPage;