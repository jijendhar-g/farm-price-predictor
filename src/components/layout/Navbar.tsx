import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Menu, X, BarChart3, MessageSquare, Sparkles, ShoppingBag, Bell, LogOut, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Dashboard", href: "#dashboard", icon: BarChart3 },
  { label: "Predictions", href: "#predictions", icon: TrendingUp },
  { label: "Marketplace", href: "#marketplace", icon: ShoppingBag },
  { label: "Alerts", href: "#alerts", icon: Bell },
  { label: "AI Assistant", href: "#chatbot", icon: MessageSquare },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-primary/10">
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between py-3">
          {/* Logo with gradient */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary/30">
              <Zap className="h-6 w-6 text-primary-foreground" />
              <div className="absolute inset-0 rounded-xl bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              <Zap className="absolute h-6 w-6 text-secondary-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-xl font-bold">
                <span className="text-gradient-primary">Agri</span>
                <span className="text-gradient-secondary">Price</span>
              </span>
              <p className="text-[10px] font-medium text-muted-foreground -mt-0.5">Predictive Analytics</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-muted/50 backdrop-blur-sm rounded-full px-2 py-1.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all rounded-full hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {user.email?.split("@")[0]}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")} className="hover:bg-primary/10">
                  Sign In
                </Button>
                <Button variant="hero" size="sm" onClick={() => navigate("/auth")} className="shadow-md shadow-primary/20">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 transition-colors"
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
            isOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-all rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary/10">
                  <link.icon className="h-4 w-4 text-primary" />
                </div>
                {link.label}
              </a>
            ))}
            <div className="flex gap-2 mt-3 px-2">
              {user ? (
                <Button variant="ghost" size="sm" className="flex-1 hover:bg-destructive/10 hover:text-destructive" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="flex-1" onClick={() => navigate("/auth")}>
                    Sign In
                  </Button>
                  <Button variant="hero" size="sm" className="flex-1" onClick={() => navigate("/auth")}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
