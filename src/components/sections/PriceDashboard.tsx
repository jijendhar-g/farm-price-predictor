import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommodityCardProps {
  name: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  icon: string;
}

const commodities: CommodityCardProps[] = [
  { name: "Tomato", price: 45.50, unit: "per kg", change: 3.20, changePercent: 7.56, icon: "🍅" },
  { name: "Onion", price: 32.00, unit: "per kg", change: -2.50, changePercent: -7.25, icon: "🧅" },
  { name: "Potato", price: 28.75, unit: "per kg", change: 0.50, changePercent: 1.77, icon: "🥔" },
  { name: "Carrot", price: 38.00, unit: "per kg", change: 1.80, changePercent: 4.97, icon: "🥕" },
  { name: "Cabbage", price: 22.50, unit: "per kg", change: -1.20, changePercent: -5.06, icon: "🥬" },
  { name: "Green Chili", price: 85.00, unit: "per kg", change: 12.00, changePercent: 16.44, icon: "🌶️" },
];

function CommodityCard({ name, price, unit, change, changePercent, icon }: CommodityCardProps) {
  const isUp = change > 0;
  const isDown = change < 0;
  const isNeutral = change === 0;

  return (
    <div className="group relative p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
            isUp && "bg-price-up/10 text-price-up",
            isDown && "bg-price-down/10 text-price-down",
            isNeutral && "bg-price-neutral/10 text-price-neutral"
          )}
        >
          {isUp && <TrendingUp className="h-3 w-3" />}
          {isDown && <TrendingDown className="h-3 w-3" />}
          {isNeutral && <Minus className="h-3 w-3" />}
          {changePercent > 0 ? "+" : ""}{changePercent.toFixed(2)}%
        </div>
      </div>

      <h3 className="font-display text-lg font-semibold text-foreground mb-1">
        {name}
      </h3>

      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold text-foreground">
          ₹{price.toFixed(2)}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Change</span>
          <span
            className={cn(
              "font-medium",
              isUp && "text-price-up",
              isDown && "text-price-down",
              isNeutral && "text-price-neutral"
            )}
          >
            {change > 0 ? "+" : ""}₹{change.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
    </div>
  );
}

export function PriceDashboard() {
  return (
    <section id="dashboard" className="py-20 bg-muted/30">
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Live Market Prices
          </h2>
          <p className="text-muted-foreground">
            Real-time commodity prices updated every 15 minutes from major agricultural markets.
          </p>
        </div>

        {/* Last Updated Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm">
            <span className="flex h-2 w-2 rounded-full bg-price-up animate-pulse" />
            <span className="text-muted-foreground">Last updated:</span>
            <span className="font-medium text-foreground">2 minutes ago</span>
          </div>
        </div>

        {/* Commodity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {commodities.map((commodity, index) => (
            <div
              key={commodity.name}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CommodityCard {...commodity} />
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="flex justify-center mt-10">
          <a
            href="#"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
          >
            View all commodities
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
