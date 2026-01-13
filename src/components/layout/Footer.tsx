import { Zap, Github, Twitter, Mail, Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-primary/10 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6 group">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-lg shadow-primary/30 transition-all group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-primary/40">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display text-xl font-bold">
                  <span className="text-gradient-primary">Agri</span>
                  <span className="text-gradient-secondary">Price</span>
                </span>
                <p className="text-xs font-medium text-muted-foreground">Predictive Analytics</p>
              </div>
            </a>
            <p className="text-muted-foreground max-w-md mb-6 leading-relaxed">
              Empowering farmers and traders with AI-driven price predictions for fair and sustainable agricultural markets.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50 hover:from-primary/10 hover:to-secondary/10 transition-all shadow-sm hover:shadow-md group"
              >
                <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50 hover:from-primary/10 hover:to-secondary/10 transition-all shadow-sm hover:shadow-md group"
              >
                <Twitter className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50 hover:from-primary/10 hover:to-secondary/10 transition-all shadow-sm hover:shadow-md group"
              >
                <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-5 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Dashboard", "Predictions", "Marketplace", "AI Assistant"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(" ", "")}`} className="text-muted-foreground hover:text-primary transition-colors font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-bold text-foreground mb-5 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-secondary" />
              Resources
            </h4>
            <ul className="space-y-3">
              {["Documentation", "Research Paper", "About LSTM", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-secondary transition-colors font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 AgriPrice. K.S. Rangasamy College of Technology.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            Built with <Heart className="h-4 w-4 text-secondary fill-secondary animate-pulse" /> for sustainable agriculture
          </p>
        </div>
      </div>
    </footer>
  );
}
