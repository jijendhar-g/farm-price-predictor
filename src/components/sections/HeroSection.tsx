import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Brain, Shield, Sparkles, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-secondary/25 to-primary/25 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-full blur-3xl animate-pulse-soft" />
      
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,black,transparent)]" />

      {/* Floating geometric shapes */}
      <div className="absolute top-32 right-20 w-16 h-16 border-2 border-primary/30 rounded-xl rotate-12 animate-float hidden lg:block" />
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-secondary rounded-lg rotate-45 animate-float hidden lg:block" style={{ animationDelay: "-2s" }} />
      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-primary/40 rounded-full animate-pulse-soft hidden lg:block" />

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20 mb-8 animate-fade-in backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-primary bg-clip-text text-transparent">
              AI-Powered Agricultural Intelligence
            </span>
            <Zap className="h-4 w-4 text-secondary animate-pulse" />
          </div>

          {/* Main Heading with gradient */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] mb-8 animate-slide-up">
            Predict Tomorrow's{" "}
            <span className="text-gradient-primary inline-block">
              Commodity
            </span>
            <br />
            <span className="text-gradient-secondary inline-block">
              Prices
            </span>{" "}
            Today
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
            Leverage <span className="text-primary font-semibold">LSTM neural networks</span> and real-time market analysis 
            to make data-driven decisions. Empower farmers and traders with accurate price forecasting.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="xl" className="group shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow">
              <span className="relative z-10 flex items-center gap-2">
                Start Predicting
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            <Button variant="heroSecondary" size="xl" className="backdrop-blur-sm">
              Watch Demo
            </Button>
          </div>

          {/* Feature Pills with glow effects */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/80 backdrop-blur-sm shadow-lg border border-primary/10 hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-foreground">95%+ Accuracy</span>
                <span className="text-xs text-muted-foreground">Proven Results</span>
              </div>
            </div>
            <div className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/80 backdrop-blur-sm shadow-lg border border-secondary/10 hover:border-secondary/30 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-secondary shadow-pink">
                <Brain className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-foreground">LSTM AI Model</span>
                <span className="text-xs text-muted-foreground">Deep Learning</span>
              </div>
            </div>
            <div className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-card/80 backdrop-blur-sm shadow-lg border border-price-up/10 hover:border-price-up/30 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-price-up to-emerald-400 shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <span className="block text-sm font-bold text-foreground">Real-time Updates</span>
                <span className="text-xs text-muted-foreground">Live Market Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
          <div className="w-7 h-12 rounded-full border-2 border-primary/40 flex items-start justify-center p-2 backdrop-blur-sm">
            <div className="w-1.5 h-3 rounded-full bg-gradient-primary animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
