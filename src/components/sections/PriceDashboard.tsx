import { TrendingUp, TrendingDown, Minus, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLatestPrices } from "@/hooks/useCommodities";
import { formatDistanceToNow } from "date-fns";

interface CommodityCardProps {
  name: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  icon: string | null;
}

function CommodityCard({ name, price, unit, change, changePercent, icon }: CommodityCardProps) {
  const isUp = change > 0;
  const isDown = change < 0;
  const isNeutral = change === 0;

  return (
    <div className="group relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl group-hover:scale-110 transition-transform duration-500">
            {icon || "🌾"}
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm",
              isUp && "bg-gradient-to-r from-price-up/20 to-emerald-400/20 text-price-up border border-price-up/20",
              isDown && "bg-gradient-to-r from-price-down/20 to-rose-400/20 text-price-down border border-price-down/20",
              isNeutral && "bg-gradient-to-r from-price-neutral/20 to-amber-400/20 text-price-neutral border border-price-neutral/20"
            )}
          >
            {isUp && <TrendingUp className="h-3.5 w-3.5" />}
            {isDown && <TrendingDown className="h-3.5 w-3.5" />}
            {isNeutral && <Minus className="h-3.5 w-3.5" />}
            {changePercent > 0 ? "+" : ""}{changePercent.toFixed(2)}%
          </div>
        </div>

        <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-gradient-primary transition-all">
          {name}
        </h3>

        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold text-gradient-primary">
            ₹{price.toFixed(2)}
          </span>
          <span className="text-sm text-muted-foreground font-medium">per {unit}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">24h Change</span>
            <span
              className={cn(
                "font-bold",
                isUp && "text-price-up",
                isDown && "text-price-down",
                isNeutral && "text-price-neutral"
              )}
            >
              {change > 0 ? "+" : ""}₹{change.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PriceDashboard() {
  const { data: commodities, isLoading, error } = useLatestPrices();

  const lastUpdated = commodities?.[0]?.recordedAt
    ? formatDistanceToNow(new Date(commodities[0].recordedAt), { addSuffix: true })
    : "recently";

  return (
    <section id="dashboard" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
            <div className="flex h-2 w-2 rounded-full bg-price-up animate-pulse" />
            <span className="text-sm font-semibold text-gradient-primary">Live Market Data</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">Real-Time </span>
            <span className="text-gradient-primary">Market Prices</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Track commodity prices from major agricultural markets across India with live updates.
          </p>
        </div>

        {/* Last Updated Badge */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-price-up opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-price-up" />
            </span>
            <span className="text-muted-foreground text-sm">Last updated:</span>
            <span className="font-semibold text-foreground text-sm">{lastUpdated}</span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 animate-pulse" />
              <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-primary" />
            </div>
            <p className="text-muted-foreground">Loading market data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/20">
            <p className="text-destructive font-medium">Failed to load prices. Please try again.</p>
          </div>
        )}

        {/* Commodity Grid */}
        {commodities && commodities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commodities.map((commodity, index) => (
              <div
                key={commodity.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <CommodityCard
                  name={commodity.name}
                  price={commodity.price}
                  unit={commodity.unit}
                  change={commodity.change}
                  changePercent={commodity.changePercent}
                  icon={commodity.icon}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {commodities && commodities.length === 0 && (
          <div className="text-center py-20">
            <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No commodities available yet.</p>
          </div>
        )}

        {/* View All Link */}
        <div className="flex justify-center mt-12">
          <a
            href="#"
            className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-primary hover:text-primary/80 transition-colors rounded-full bg-primary/5 hover:bg-primary/10 border border-primary/20"
          >
            View all commodities
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
