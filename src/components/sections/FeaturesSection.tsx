import { Brain, TrendingUp, MessageSquare, Shield, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "LSTM Deep Learning",
    description: "Advanced neural networks trained on years of historical price data for accurate predictions.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description: "Live market data integration with instant price updates from major agricultural markets.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    description: "Natural language interface for easy access to market insights and recommendations.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Shield,
    title: "Fair Trade Support",
    description: "Reduce middlemen exploitation and ensure fair pricing for farmers and consumers.",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: Zap,
    title: "Instant Predictions",
    description: "Get price forecasts in seconds with confidence intervals and trend analysis.",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Available in multiple regional languages for wider accessibility across farming communities.",
    color: "bg-primary/10 text-primary",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container px-4">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-primary mb-4">
            <Zap className="h-4 w-4" />
            Platform Features
          </div>
          <h2 className="section-title">Why Choose AgriPrice</h2>
          <p className="section-description">
            Advanced technology stack combining AI, real-time data, and intuitive design
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card-interactive p-6 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
