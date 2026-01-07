import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Menu, X, BarChart3, MessageSquare, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Dashboard", href: "#dashboard", icon: BarChart3 },
  { label: "Predictions", href: "#predictions", icon: TrendingUp },
  { label: "AI Assistant", href: "#chatbot", icon: MessageSquare },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow transition-transform group-hover:scale-105">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-bold text-foreground">
                Agri<span className="text-primary">Price</span>
              </span>
              <p className="text-[10px] text-muted-foreground -mt-1">Predictive Analytics</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button variant="hero" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </a>
            ))}
            <div className="flex gap-2 mt-2 px-2">
              <Button variant="ghost" size="sm" className="flex-1">
                Sign In
              </Button>
              <Button variant="hero" size="sm" className="flex-1">
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
