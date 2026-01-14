import { Link } from "react-router";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container m-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              ProcureAI
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              to="/"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/chat"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Chat
            </Link>
            <Link
              to="/rfps"
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              My RFPs
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            Log in
          </Button>
          <Link to="/chat">
            <Button size="sm" className="hidden md:inline-flex">
              Get Started
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
