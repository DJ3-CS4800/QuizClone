import { useParams, useNavigate } from "react-router-dom";
import StudyDeck from "../study-deck"; // Import the study deck component
import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LeftSidebar } from "@/components/left-sidebar";

const DeckPage = () => {
  const { deckID } = useParams<{ deckID: string }>();
  const { deckType } = useParams<{ deckType: string }>();
  const navigate = useNavigate();
  const [leftOpen, setLeftOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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
          <div className="flex w-full h-max-content ">
            <main className="flex-1 h-max-content">
              <header className="flex h-20 items-center justify-between px-4">
                <Button variant="ghost" size="icon" onClick={toggleLeft}>
                  <Menu className="h-6 w-6 scale-175 text-[var(--accent2)]" />
                  <span className="sr-only">Toggle left sidebar</span>
                </Button>
                <span className="mb-4 text-2xl font-bold justify-center text-[var(--accent)]">Study</span>
                <Button variant="ghost" onClick={goToMain}>
                  <X className="h-6 w-6 scale-175 text-[var(--accent2)]" />
                </Button>
              </header>
              <div className="p-4 ">
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
