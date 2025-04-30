import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudyDeck from "../study-deck"; // Import the study deck component
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
  const [leftOpen, setLeftOpen] = useState(false);
  const [isDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  // Handle window resize for mobile view.
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  if (!deckID) return <div className="text-center text-red-500">Invalid deck ID</div>;

  if (deckType !== "r" && deckType !== "l")
    return <div className="text-center text-red-500">Invalid link</div>;

  const toggleLeft = () => setLeftOpen((prev) => !prev);

  const goToMain = () => {
    navigate("/");
  };

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
                    onClick={() => navigate("/")}
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