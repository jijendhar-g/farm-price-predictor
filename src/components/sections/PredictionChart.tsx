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
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
        <p className="font-display font-semibold text-foreground mb-2">{label}</p>
        {data.actual !== null && data.actual !== undefined && (
          <div className="flex items-center gap-2 text-sm mb-1">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Actual:</span>
            <span className="font-medium text-foreground">₹{data.actual}</span>
          </div>
        )}
        {data.predicted !== null && data.predicted !== undefined && (
          <div className="flex items-center gap-2 text-sm mb-1">
            <span className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-muted-foreground">Predicted:</span>
            <span className="font-medium text-foreground">₹{data.predicted}</span>
          </div>
        )}
        {data.lower !== undefined && data.upper !== undefined && (
          <div className="text-xs text-muted-foreground mt-2">
            Range: ₹{data.lower} - ₹{data.upper}
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

  // Set default selected commodity once loaded
  const activeCommodityId = selectedCommodityId || commodities?.[0]?.id;

  const { data: predictions, isLoading: loadingPredictions } = usePredictions(activeCommodityId);
  const { data: priceData, isLoading: loadingPrices } = usePriceData(activeCommodityId);

  const isLoading = loadingCommodities || loadingPredictions || loadingPrices;

  // Combine actual prices and predictions into chart data
  const chartData = (() => {
    if (!priceData && !predictions) return [];

    const dataMap = new Map<string, { date: string; actual?: number; predicted?: number; lower?: number; upper?: number }>();

    // Add actual price data
    priceData?.slice(0, 30).reverse().forEach((price) => {
      const dateKey = format(new Date(price.recorded_at), "MMM dd");
      dataMap.set(dateKey, {
        date: dateKey,
        actual: price.price,
      });
    });

    // Add prediction data
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
    <section id="predictions" className="py-20">
      <div className="container px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            LSTM Price Predictions
          </h2>
          <p className="text-muted-foreground">
            Our deep learning model analyzes historical data, seasonal patterns, and market trends to forecast future prices with high accuracy.
          </p>
        </div>

        {/* Commodity Selector */}
        {loadingCommodities ? (
          <div className="flex justify-center mb-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {commodities?.map((commodity) => (
              <Button
                key={commodity.id}
                variant={activeCommodityId === commodity.id ? "hero" : "glass"}
                size="lg"
                onClick={() => setSelectedCommodityId(commodity.id)}
                className="gap-2"
              >
                <span className="text-lg">{commodity.icon || "🌾"}</span>
                {commodity.name}
              </Button>
            ))}
          </div>
        )}

        {/* Chart Container */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-md">
          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded bg-primary" />
              <span className="text-sm text-muted-foreground">Actual Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded bg-secondary" />
              <span className="text-sm text-muted-foreground">Predicted Price</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 rounded bg-primary/20" />
              <span className="text-sm text-muted-foreground">Confidence Interval</span>
            </div>
          </div>

          {/* Chart */}
          <div className="h-[400px] w-full">
            {isLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No data available for this commodity</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(142, 45%, 28%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(142, 45%, 28%)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(140, 15%, 88%)" opacity={0.5} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "hsl(140, 15%, 40%)" }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(140, 15%, 88%)" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(140, 15%, 40%)" }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(140, 15%, 88%)" }}
                    tickFormatter={(value) => `₹${value}`}
                    domain={["dataMin - 5", "dataMax + 5"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Confidence Interval Area */}
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
                  
                  {/* Predicted Line */}
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="hsl(38, 92%, 50%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(38, 92%, 50%)", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: "hsl(38, 92%, 50%)", strokeWidth: 2, stroke: "hsl(var(--card))" }}
                    strokeDasharray="0"
                  />
                  
                  {/* Actual Line */}
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="hsl(142, 45%, 28%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(142, 45%, 28%)", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: "hsl(142, 45%, 28%)", strokeWidth: 2, stroke: "hsl(var(--card))" }}
                    connectNulls={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Prediction Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Model Accuracy</p>
              <p className="font-display text-2xl font-bold text-primary">
                {avgConfidence > 0 ? `${avgConfidence.toFixed(1)}%` : "—"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Commodity</p>
              <p className="font-display text-2xl font-bold text-foreground">
                {selectedCommodity?.icon || "🌾"} {selectedCommodity?.name || "—"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Latest Forecast</p>
              <p className="font-display text-2xl font-bold text-secondary">
                {latestPrediction ? `₹${latestPrediction.predicted_price}` : "—"}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Unit</p>
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
