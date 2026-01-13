import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCommodities, usePredictions, usePriceData } from "@/hooks/useCommodities";
import { Loader2, TrendingUp, Target, Sparkles } from "lucide-react";
import { format } from "date-fns";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl p-5 shadow-2xl">
        <p className="font-display font-bold text-foreground mb-3">{label}</p>
        {data.actual !== null && data.actual !== undefined && (
          <div className="flex items-center gap-3 text-sm mb-2">
            <span className="w-4 h-4 rounded-full bg-gradient-primary shadow-lg" />
            <span className="text-muted-foreground">Actual:</span>
            <span className="font-bold text-foreground">₹{data.actual}</span>
          </div>
        )}
        {data.predicted !== null && data.predicted !== undefined && (
          <div className="flex items-center gap-3 text-sm mb-2">
            <span className="w-4 h-4 rounded-full bg-gradient-secondary shadow-lg" />
            <span className="text-muted-foreground">Predicted:</span>
            <span className="font-bold text-foreground">₹{data.predicted}</span>
          </div>
        )}
        {data.lower !== undefined && data.upper !== undefined && (
          <div className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border/50">
            Confidence Range: ₹{data.lower} - ₹{data.upper}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function PredictionChart() {
  const { data: commodities, isLoading: loadingCommodities } = useCommodities();
  const [selectedCommodityId, setSelectedCommodityId] = useState<string | null>(null);

  const activeCommodityId = selectedCommodityId || commodities?.[0]?.id;

  const { data: predictions, isLoading: loadingPredictions } = usePredictions(activeCommodityId);
  const { data: priceData, isLoading: loadingPrices } = usePriceData(activeCommodityId);

  const isLoading = loadingCommodities || loadingPredictions || loadingPrices;

  const chartData = (() => {
    if (!priceData && !predictions) return [];

    const dataMap = new Map<string, { date: string; actual?: number; predicted?: number; lower?: number; upper?: number }>();

    priceData?.slice(0, 30).reverse().forEach((price) => {
      const dateKey = format(new Date(price.recorded_at), "MMM dd");
      dataMap.set(dateKey, {
        date: dateKey,
        actual: price.price,
      });
    });

    predictions?.forEach((prediction) => {
      const dateKey = format(new Date(prediction.prediction_date), "MMM dd");
      const existing = dataMap.get(dateKey) || { date: dateKey };
      const confidence = prediction.confidence_score || 0.9;
      const range = prediction.predicted_price * (1 - confidence) * 0.5;
      
      dataMap.set(dateKey, {
        ...existing,
        predicted: prediction.predicted_price,
        lower: Math.round(prediction.predicted_price - range),
        upper: Math.round(prediction.predicted_price + range),
      });
    });

    return Array.from(dataMap.values());
  })();

  const selectedCommodity = commodities?.find((c) => c.id === activeCommodityId);
  const latestPrediction = predictions?.[predictions.length - 1];
  const avgConfidence = predictions?.length
    ? (predictions.reduce((acc, p) => acc + (p.confidence_score || 0), 0) / predictions.length) * 100
    : 0;

  return (
    <section id="predictions" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20 mb-6">
            <TrendingUp className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold text-gradient-secondary">LSTM Neural Network</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-foreground">AI </span>
            <span className="text-gradient-secondary">Price Predictions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our deep learning model analyzes historical data, seasonal patterns, and market trends to forecast future prices with high accuracy.
          </p>
        </div>

        {/* Commodity Selector */}
        {loadingCommodities ? (
          <div className="flex justify-center mb-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {commodities?.map((commodity) => (
              <Button
                key={commodity.id}
                variant={activeCommodityId === commodity.id ? "hero" : "glass"}
                size="lg"
                onClick={() => setSelectedCommodityId(commodity.id)}
                className={cn(
                  "gap-2 rounded-xl transition-all",
                  activeCommodityId === commodity.id && "shadow-lg shadow-primary/30"
                )}
              >
                <span className="text-xl">{commodity.icon || "🌾"}</span>
                {commodity.name}
              </Button>
            ))}
          </div>
        )}

        {/* Chart Container */}
        <div className="bg-card/90 backdrop-blur-xl rounded-3xl border border-primary/10 p-8 shadow-2xl shadow-primary/5">
          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-5 h-2 rounded-full bg-gradient-primary shadow-lg" />
              <span className="text-sm font-medium text-muted-foreground">Actual Price</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-2 rounded-full bg-gradient-secondary shadow-lg" />
              <span className="text-sm font-medium text-muted-foreground">Predicted Price</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-3 rounded bg-primary/20" />
              <span className="text-sm font-medium text-muted-foreground">Confidence Interval</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[400px] w-full">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-secondary/20 animate-pulse" />
                  <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-secondary" />
                </div>
                <p className="text-muted-foreground">Loading predictions...</p>
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                <Sparkles className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">No data available for this commodity</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="actualLineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
                      <stop offset="100%" stopColor="hsl(280, 80%, 60%)" />
                    </linearGradient>
                    <linearGradient id="predictedLineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(330, 85%, 60%)" />
                      <stop offset="100%" stopColor="hsl(40, 100%, 60%)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(250, 20%, 90%)" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "hsl(250, 20%, 45%)" }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(250, 20%, 90%)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(250, 20%, 45%)" }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(250, 20%, 90%)" }}
                    tickFormatter={(value) => `₹${value}`}
                    domain={["dataMin - 5", "dataMax + 5"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Area
                    type="monotone"
                    dataKey="upper"
                    stroke="none"
                    fill="url(#confidenceGradient)"
                    fillOpacity={1}
                  />
                  <Area
                    type="monotone"
                    dataKey="lower"
                    stroke="none"
                    fill="hsl(var(--background))"
                    fillOpacity={1}
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="url(#predictedLineGradient)"
                    strokeWidth={4}
                    dot={{ fill: "hsl(330, 85%, 60%)", strokeWidth: 0, r: 5 }}
                    activeDot={{ r: 8, fill: "hsl(330, 85%, 60%)", strokeWidth: 3, stroke: "hsl(var(--card))" }}
                  />
                  
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="url(#actualLineGradient)"
                    strokeWidth={4}
                    dot={{ fill: "hsl(262, 83%, 58%)", strokeWidth: 0, r: 5 }}
                    activeDot={{ r: 8, fill: "hsl(262, 83%, 58%)", strokeWidth: 3, stroke: "hsl(var(--card))" }}
                    connectNulls={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Prediction Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/50">
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
              <p className="text-sm text-muted-foreground mb-2">Model Accuracy</p>
              <p className="font-display text-3xl font-bold text-gradient-primary">
                {avgConfidence > 0 ? `${avgConfidence.toFixed(1)}%` : "—"}
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/10">
              <p className="text-sm text-muted-foreground mb-2">Commodity</p>
              <p className="font-display text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                <span>{selectedCommodity?.icon || "🌾"}</span>
                <span>{selectedCommodity?.name || "—"}</span>
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-amber-500/5 to-amber-500/10 border border-amber-500/10">
              <p className="text-sm text-muted-foreground mb-2">Latest Forecast</p>
              <p className="font-display text-3xl font-bold text-gradient-secondary">
                {latestPrediction ? `₹${latestPrediction.predicted_price}` : "—"}
              </p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-muted to-muted/50 border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Unit</p>
              <p className="font-display text-2xl font-bold text-muted-foreground">
                per {selectedCommodity?.unit || "kg"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
