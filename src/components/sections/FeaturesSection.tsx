import { Brain, TrendingUp, MessageSquare, Shield, Zap, Globe, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "LSTM Deep Learning",
    description: "Advanced neural networks trained on years of historical price data for accurate predictions.",
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20",
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description: "Live market data integration with instant price updates from major agricultural markets.",
    gradient: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
  },
  {
    icon: MessageSquare,
    title: "NLP Chatbot",
    description: "Natural language interface for easy access to market insights and recommendations.",
    gradient: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/20",
  },
  {
    icon: Shield,
    title: "Fair Trade Support",
    description: "Reduce middlemen exploitation and ensure fair pricing for farmers and consumers.",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Instant Predictions",
    description: "Get price forecasts in seconds with confidence intervals and trend analysis.",
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/20",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Available in multiple regional languages for wider accessibility across farming communities.",
    gradient: "from-indigo-500 to-violet-600",
    shadow: "shadow-indigo-500/20",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-gradient-primary">Powered by AI</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">Advanced </span>
            <span className="text-gradient-primary">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our three-layer architecture combines data processing, machine learning, and intuitive interfaces for comprehensive market intelligence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-up hover:-translate-y-2 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Icon with gradient background */}
              <div
                className={`relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.shadow} mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
              >
                <feature.icon className="h-7 w-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-gradient-primary transition-all">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom gradient line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-card via-card to-muted/50 border border-primary/10 shadow-xl">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-center mb-10">
              <span className="text-gradient-primary">System</span> Architecture
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
              {/* Data Layer */}
              <div className="group flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 shadow-lg w-full md:w-auto hover:scale-105 transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/20">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="font-display font-bold text-foreground">Data Layer</p>
                <p className="text-xs text-muted-foreground text-center mt-1">Market APIs, Historical Data</p>
              </div>

              <div className="hidden md:flex items-center">
                <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
                <div className="w-3 h-3 bg-pink-500 rounded-full -ml-1" />
              </div>
              <div className="md:hidden w-1 h-8 bg-gradient-to-b from-violet-500 to-pink-500 rounded-full" />

              {/* Application Layer */}
              <div className="group flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 shadow-lg w-full md:w-auto hover:scale-105 transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/20">
                  <span className="text-2xl">🧠</span>
                </div>
                <p className="font-display font-bold text-foreground">Application Layer</p>
                <p className="text-xs text-muted-foreground text-center mt-1">LSTM Model, NLP Engine</p>
              </div>

              <div className="hidden md:flex items-center">
                <div className="w-3 h-3 bg-pink-500 rounded-full -mr-1" />
                <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-emerald-500 rounded-full" />
              </div>
              <div className="md:hidden w-1 h-8 bg-gradient-to-b from-pink-500 to-emerald-500 rounded-full" />

              {/* Presentation Layer */}
              <div className="group flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 shadow-lg w-full md:w-auto hover:scale-105 transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                  <span className="text-2xl">📱</span>
                </div>
                <p className="font-display font-bold text-foreground">Presentation Layer</p>
                <p className="text-xs text-muted-foreground text-center mt-1">Web & Mobile UI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
