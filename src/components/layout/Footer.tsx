import { Leaf, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-lg text-foreground">AgriPrice</span>
                <p className="text-xs text-muted-foreground">Smart Farming</p>
              </div>
            </a>
            <p className="text-muted-foreground max-w-md mb-4 text-sm">
              Empowering farmers with AI-driven price predictions for informed decision-making and sustainable agriculture.
            </p>
            <div className="flex gap-2">
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <Github className="h-4 w-4 text-muted-foreground" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <Twitter className="h-4 w-4 text-muted-foreground" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                <Mail className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {["Dashboard", "Predictions", "Marketplace", "AI Chat"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(" ", "")}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              {["Documentation", "API Access", "Research", "Support"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 AgriPrice. K.S. Rangasamy College of Technology.</p>
          <p>Built for sustainable agriculture</p>
        </div>
      </div>
    </footer>
  );
}
