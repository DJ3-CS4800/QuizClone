import { useParams, useNavigate } from "react-router-dom";
import StudyDeck from "../study-deck"; // Import the study deck component
import React from "react";
import { Menu, X, Edit, Trash, Play } from "lucide-react"; // Import icons
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

  const handleStudy = () => {
    navigate(`/study/${deckID}`);
  };

  const handleEdit = () => {
    navigate(`/edit/${deckID}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this deck?")) {
      // Add delete logic here
      alert("Deck deleted!");
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <SidebarProvider defaultOpen={!isMobile} open={leftOpen} onOpenChange={setLeftOpen}>
        {isMobile ? (
          <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
            <SheetContent side="left" className="w-full p-0">
              <Sidebar style={{ "--sidebar-width": "280px" } as React.CSSProperties}>
                <LeftSidebar />
              </Sidebar>
            </SheetContent>
          </Sheet>
        ) : (
          <Sidebar variant="inset" className="border-r h-full w-[280px]">
            <LeftSidebar />
          </Sidebar>
        )}

        <SidebarInset className="flex-1 h-full overflow-auto">
          <div className="flex flex-col w-full h-full">
            <main className="flex-1 h-full overflow-auto">
              <header className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Button variant="ghost" size="icon" onClick={toggleLeft}>
                  <Menu className="h-6 w-6 scale-175 text-[var(--accent2)]" />
                  <span className="sr-only">Toggle left sidebar</span>
                </Button>
                <span className="text-2xl font-bold text-[var(--accent)]">Study</span>
                <Button variant="ghost" onClick={goToMain}>
                  <X className="h-6 w-6 scale-175 text-[var(--accent2)]" />
                </Button>
              </header>

              {/* Buttons Section */}
              <div className="flex flex-wrap items-center justify-center gap-4 p-4 sm:p-6 lg:p-8">
                <Button
                  variant="default"
                  className="flex items-center gap-2"
                  onClick={handleStudy}
                >
                  <Play className="h-5 w-5" />
                  Study
                </Button>
                <Button
                  variant="default"
                  className="flex items-center gap-2"
                  onClick={handleEdit}
                >
                  <Edit className="h-5 w-5" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                  onClick={handleDelete}
                >
                  <Trash className="h-5 w-5" />
                  Delete
                </Button>
              </div>

              {/* StudyDeck Component */}
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