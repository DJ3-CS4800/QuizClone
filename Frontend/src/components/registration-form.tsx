import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"


export function RegistrationForm({ className, ...props }: React.ComponentProps<"div">) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  const handleClose = () => {
    navigate("/login");
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://quizclone.com/api/account/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Registration failed. Please try again.");
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="relative overflow-hidden bg-muted text-muted-foreground">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={handleClose}
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </Button>

        <CardContent className="grid h-full p-0">
          <form onSubmit={handleRegister} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-[var(--accent-foreground)]">Create an Account</h1>
                <p className="text-balance text-muted-foreground">Sign up for a Quizclone Account</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-[var(--accent-foreground)]">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter Your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-muted text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[var(--accent-foreground)]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted text-muted-foreground"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-[var(--accent-foreground)]">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-muted text-muted-foreground"
                />
              </div>
              {error && <p className="text-red-500 text-center text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full  sm:text-base cursor-pointer border border-border bg-[var(--accent2)] hover:bg-[var(--accent)]  transition-colors text-black"
                disabled={loading}
              >
                {loading ? "Registering..." : "Sign Up"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="cursor-pointer underline underline-offset-4 text-[var(--accent)] hover:text-[var(--accent3)] transition-colors"
                >
                  Login
                </span>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[var(--accent)]">
        By signing up, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
