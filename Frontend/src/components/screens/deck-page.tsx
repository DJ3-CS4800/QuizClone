import { useParams, useNavigate } from "react-router-dom";
import StudyDeck from "../study-deck"; // Import the study deck component
import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LeftSidebar } from "@/components/left-sidebar";

const DeckPage = () => {
  const { deckID } = useParams<{ deckID: string }>();
  const navigate = useNavigate(); // Initialize navigate
  const [leftOpen, setLeftOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!deckID) return <div className="text-center text-red-500">Invalid deck ID</div>;

  const toggleLeft = () => setLeftOpen((prev) => !prev);

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
              </header>
              <div className="p-4">
                <StudyDeck deckId={deckID} />
                {/* Study Button */}
                <Button
                  variant="default"
                  className="mt-4"
                  onClick={() => navigate(`/quiz/${deckID}`)}
                >
                  Study
                </Button>
              </div>
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default DeckPage;