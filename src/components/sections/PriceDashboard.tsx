import { TrendingUp, TrendingDown, Minus, Loader2, Package, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLatestPrices } from "@/hooks/useCommodities";
import { useRealtimePriceData } from "@/hooks/useRealtimeData";
import { LiveIndicator } from "@/components/ui/LiveIndicator";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface CommodityCardProps {
  name: string;
  price: number;
  unit: string;
  change: number;
  changePercent: number;
  icon: string | null;
  mandiName?: string;
}

function CommodityCard({ name, price, unit, change, changePercent, icon, mandiName }: CommodityCardProps) {
  const isUp = change > 0;
  const isDown = change < 0;
  const isNeutral = change === 0;

  return (
    <div className="card-interactive p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{icon || "🌾"}</div>
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
          {changePercent > 0 ? "+" : ""}{changePercent.toFixed(1)}%
        </div>
      </div>

      <h3 className="font-semibold text-lg text-foreground mb-1">{name}</h3>
      {mandiName && (
        <p className="text-xs text-muted-foreground mb-3">{mandiName}</p>
      )}

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">₹{price.toFixed(0)}</span>
        <span className="text-sm text-muted-foreground">/{unit}</span>
      </div>

      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Change</span>
        <span className={cn(
          "font-medium",
          isUp && "text-price-up",
          isDown && "text-price-down",
          isNeutral && "text-price-neutral"
        )}>
          {change > 0 ? "+" : ""}₹{change.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function PriceCardSkeleton() {
  return (
    <div className="card-interactive p-5">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-6 w-24 mb-1" />
      <Skeleton className="h-4 w-20 mb-3" />
      <Skeleton className="h-8 w-28" />
      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function PriceDashboard() {
  const { data: commodities, isLoading, error, refetch, isFetching } = useLatestPrices();
  const { lastUpdate } = useRealtimePriceData();

  const lastUpdated = commodities?.[0]?.recordedAt
    ? formatDistanceToNow(new Date(commodities[0].recordedAt), { addSuffix: true })
    : "recently";

  return (
    <section id="dashboard" className="py-16 bg-muted/30">
      <div className="container px-4">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-primary mb-4">
            <span className="h-2 w-2 rounded-full bg-price-up animate-pulse" />
            Live Market Data
          </div>
          <h2 className="section-title">Today's Market Prices</h2>
          <p className="section-description">
            Real-time commodity prices from major agricultural markets across India
          </p>
        </div>

        {/* Last Updated with Real-time indicator */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-card border border-border text-sm">
            <LiveIndicator lastUpdate={lastUpdate} />
            <span className="text-muted-foreground">Updated {lastUpdated}</span>
            <button 
              onClick={() => refetch()}
              className="p-1 hover:bg-muted rounded-full transition-colors"
              disabled={isFetching}
            >
              <RefreshCw className={cn("h-4 w-4 text-muted-foreground", isFetching && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Loading State with Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <PriceCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-destructive/5 rounded-xl border border-destructive/20">
            <p className="text-destructive font-medium">Failed to load prices. Please try again.</p>
          </div>
        )}

        {/* Commodity Grid */}
        {commodities && commodities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {commodities.map((commodity, index) => (
              <div
                key={commodity.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CommodityCard
                  name={commodity.name}
                  price={commodity.price}
                  unit={commodity.unit}
                  change={commodity.change}
                  changePercent={commodity.changePercent}
                  icon={commodity.icon}
                  mandiName={commodity.mandiName}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {commodities && commodities.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No commodities available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
