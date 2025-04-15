import { useEffect, useState } from "react";
import { User, icons, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export function LeftSidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setLoading(true);

      const fetchUserData = async () => {
        try {
          const response = await fetch("https://quizclone.com/api/auth/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Verification failed");
          }

          const data = await response.json();
          setUser({ name: data.username, email: data.email, avatar: data.avatar });
        } catch (error) {
          console.error("User verification failed:", error);
          localStorage.removeItem("username");
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [isDarkMode]);

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleSearchClick = () => {
    navigate("/search");
  }

  const handleCreateDeckClick = () => {
    navigate("/create-deck");
  };

  const handleSignOutClick = () => {
    setIsDialogOpen(true);
  };

  const handleConfirmSignOut = async () => {
    try {
      const response = await fetch("https://quizclone.com/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      localStorage.removeItem("username");
      setUser(null);
      setIsDialogOpen(false);
      navigate("/");
      window.location.reload();
      sessionStorage.clear();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCancelSignOut = () => {
    setIsDialogOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <>
      <SidebarHeader className="h-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-16 hover:bg-[var(--accent)]"
              onClick={() => !user && navigate("/login")}
            >
              <Avatar className="h-8 w-8">
                {user ? (
                  <>
                    <AvatarImage src={user.avatar || ""} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback>?</AvatarFallback>
                )}
              </Avatar>
              <div className="ml-2 flex flex-col items-start">
                {loading ? (
                  <span className="text-sm font-semibold">Loading...</span>
                ) : user ? (
                  <>
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </>
                ) : (
                  <span className="text-sm font-semibold">Sign In</span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-[var(--accent)]" onClick={handleHomeClick}>
                  <icons.House className="mr-2 h-4 w-4 text-[var(--accent2)]" />
                  Home
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-[var(--accent)]">
                  <icons.Search className="mr-2 h-4 w-4 text-[var(--accent2)]" onClick={handleSearchClick} />
                  Search
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-[var(--accent)]" onClick={handleCreateDeckClick}>
                  <icons.Plus className="mr-2 h-4 w-4 text-[var(--accent2)]" />
                  Create Deck
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-[var(--accent)]" onClick={toggleDarkMode}>
                  {isDarkMode ? (
                    <Sun className="mr-2 h-4 w-4  text-[var(--accent2)]" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4  text-[var(--accent2)]" />
                  )}
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton className="hover:bg-[var(--accent)]" onClick={handleSignOutClick}>
                    <icons.LogOut className="mr-2 h-4 w-4 text-[var(--accent2)]" />
                    Sign Out
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>Are you sure you want to sign out?</DialogTitle>
          <DialogDescription>
            You will only be able to access your local decks.
          </DialogDescription>
          <div className="flex justify-end gap-2">
            <DialogFooter>
              <Button className="text-muted-foreground hover:text-[var(--accent3)]" variant="outline" onClick={handleCancelSignOut}>
                Cancel
              </Button>
            </DialogFooter>
            <DialogFooter>
              <Button
                className="text-[var(--accent)] hover:text-[var(--accent3)]" variant="outline"
                onClick={handleConfirmSignOut}
              >
                Sign Out
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}