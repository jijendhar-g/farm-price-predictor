import { Leaf, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display text-lg font-bold text-foreground">
                  Agri<span className="text-primary">Price</span>
                </span>
                <p className="text-[10px] text-muted-foreground -mt-1">Predictive Analytics</p>
              </div>
            </a>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              Empowering farmers and traders with AI-driven price predictions for fair and sustainable agricultural markets.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors"
              >
                <Github className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors"
              >
                <Twitter className="h-4 w-4 text-muted-foreground" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors"
              >
                <Mail className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#predictions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Predictions
                </a>
              </li>
              <li>
                <a href="#chatbot" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  AI Assistant
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  API Access
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Research Paper
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About LSTM
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 AgriPrice. K.S. Rangasamy College of Technology.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ for sustainable agriculture
          </p>
        </div>
      </div>
    </footer>
  );
}
