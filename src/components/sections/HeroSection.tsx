import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, BarChart3, Shield, Leaf } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.08),transparent_50%)]" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.5)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]" />

      <div className="container relative z-10 px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="badge-primary mb-8 animate-fade-in">
            <Leaf className="h-4 w-4" />
            <span>AI-Powered Agricultural Analytics</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            Smart Price{" "}
            <span className="text-gradient-primary">Predictions</span>
            <br />
            for <span className="text-gradient-secondary">Indian Farmers</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Make informed decisions with LSTM-powered price forecasting. 
            Track real-time mandi prices, get accurate predictions, and maximize your profits.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" className="btn-primary group px-8">
              View Live Prices
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg" className="btn-outline px-8">
              How It Works
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="stat-card group hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-foreground">95%+</p>
                  <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                </div>
              </div>
            </div>
            
            <div className="stat-card group hover:border-secondary/30 transition-colors">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <BarChart3 className="h-5 w-5 text-secondary" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-foreground">50+</p>
                  <p className="text-sm text-muted-foreground">Mandis Covered</p>
                </div>
              </div>
            </div>
            
            <div className="stat-card group hover:border-accent/30 transition-colors">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Shield className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-foreground">Real-time</p>
                  <p className="text-sm text-muted-foreground">Market Updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
