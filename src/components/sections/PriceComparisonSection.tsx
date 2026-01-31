import { Scale, TrendingUp, TrendingDown, MapPin, ArrowRight } from "lucide-react";
import { usePriceData, useCommodities } from "@/hooks/useCommodities";
import { Loader2 } from "lucide-react";

export function PriceComparisonSection() {
  const { data: commodities, isLoading: commoditiesLoading } = useCommodities();
  const { data: priceData, isLoading: priceLoading } = usePriceData();

  const isLoading = commoditiesLoading || priceLoading;

  // Group prices by commodity and find price differences across mandis
  const priceComparisons = commodities?.slice(0, 6).map(commodity => {
    const commodityPrices = priceData?.filter(p => p.commodity_id === commodity.id) || [];
    const uniqueMandis = [...new Set(commodityPrices.map(p => p.mandi_name))];
    
    const mandiPrices = uniqueMandis.map(mandi => {
      const price = commodityPrices.find(p => p.mandi_name === mandi);
      return { mandi, price: price?.price || 0, location: price?.mandi_location || "" };
    }).filter(p => p.price > 0);

    const sortedPrices = mandiPrices.sort((a, b) => a.price - b.price);
    const lowest = sortedPrices[0];
    const highest = sortedPrices[sortedPrices.length - 1];
    const diff = highest && lowest ? highest.price - lowest.price : 0;

    return {
      ...commodity,
      lowest,
      highest,
      diff,
      profitPercent: lowest && highest && lowest.price > 0 
        ? ((diff / lowest.price) * 100).toFixed(1) 
        : "0"
    };
  }).filter(c => c.lowest && c.highest && c.diff > 0) || [];

  return (
    <section id="comparison" className="py-16 bg-muted/30">
      <div className="container px-4">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge-primary mb-4">
            <Scale className="h-4 w-4" />
            Price Comparison
          </div>
          <h2 className="section-title">Mandi Price Comparison</h2>
          <p className="section-description">
            Find arbitrage opportunities by comparing prices across different markets
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && priceComparisons.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priceComparisons.map((comparison) => (
              <div key={comparison.id} className="card-elevated p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{comparison.icon}</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{comparison.name}</h3>
                    <p className="text-xs text-muted-foreground">per {comparison.unit}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {/* Lowest Price */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-price-up/5 border border-price-up/20">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-price-up" />
                      <div>
                        <p className="text-xs text-muted-foreground">Lowest Price</p>
                        <p className="text-sm font-medium text-foreground">{comparison.lowest?.mandi}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-price-up">₹{comparison.lowest?.price}</p>
                  </div>

                  {/* Highest Price */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-price-down/5 border border-price-down/20">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-price-down" />
                      <div>
                        <p className="text-xs text-muted-foreground">Highest Price</p>
                        <p className="text-sm font-medium text-foreground">{comparison.highest?.mandi}</p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-price-down">₹{comparison.highest?.price}</p>
                  </div>
                </div>

                {/* Arbitrage Opportunity */}
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Profit Potential</p>
                    <p className="text-lg font-bold text-primary">₹{comparison.diff.toFixed(0)}/unit</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    +{comparison.profitPercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && priceComparisons.length === 0 && (
          <div className="text-center py-12">
            <Scale className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No price comparison data available</p>
          </div>
        )}
      </div>
    </section>
  );
}
