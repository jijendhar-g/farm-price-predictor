import { Brain, TrendingUp, MessageSquare, Shield, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "LSTM Deep Learning",
    description: "Advanced neural networks trained on years of historical price data for accurate predictions.",
    color: "primary",
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description: "Live market data integration with instant price updates from major agricultural markets.",
    color: "secondary",
  },
  {
    icon: MessageSquare,
    title: "NLP Chatbot",
    description: "Natural language interface for easy access to market insights and recommendations.",
    color: "primary",
  },
  {
    icon: Shield,
    title: "Fair Trade Support",
    description: "Reduce middlemen exploitation and ensure fair pricing for farmers and consumers.",
    color: "secondary",
  },
  {
    icon: Zap,
    title: "Instant Predictions",
    description: "Get price forecasts in seconds with confidence intervals and trend analysis.",
    color: "primary",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Available in multiple regional languages for wider accessibility across farming communities.",
    color: "secondary",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Powered by Advanced AI
          </h2>
          <p className="text-muted-foreground">
            Our three-layer architecture combines data processing, machine learning, and intuitive interfaces for comprehensive market intelligence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 animate-slide-up hover:shadow-md"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
                  feature.color === "primary"
                    ? "bg-gradient-primary shadow-glow text-primary-foreground"
                    : "bg-gradient-secondary shadow-gold text-secondary-foreground"
                }`}
              >
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300" />
            </div>
          ))}
        </div>

        {/* Architecture Diagram Preview */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-hero/5 border border-primary/10">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-display text-xl font-semibold text-foreground text-center mb-8">
              System Architecture
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              {/* Data Layer */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-card border border-border shadow-sm w-full md:w-auto">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <span className="text-lg">📊</span>
                </div>
                <p className="font-medium text-sm text-foreground">Data Layer</p>
                <p className="text-xs text-muted-foreground text-center">Market APIs, Historical Data</p>
              </div>

              <div className="text-2xl text-muted-foreground/50 rotate-90 md:rotate-0">→</div>

              {/* Application Layer */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-card border border-border shadow-sm w-full md:w-auto">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-2">
                  <span className="text-lg">🧠</span>
                </div>
                <p className="font-medium text-sm text-foreground">Application Layer</p>
                <p className="text-xs text-muted-foreground text-center">LSTM Model, NLP Engine</p>
              </div>

              <div className="text-2xl text-muted-foreground/50 rotate-90 md:rotate-0">→</div>

              {/* Presentation Layer */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-card border border-border shadow-sm w-full md:w-auto">
                <div className="w-10 h-10 rounded-lg bg-price-up/10 flex items-center justify-center mb-2">
                  <span className="text-lg">📱</span>
                </div>
                <p className="font-medium text-sm text-foreground">Presentation Layer</p>
                <p className="text-xs text-muted-foreground text-center">Web & Mobile UI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
