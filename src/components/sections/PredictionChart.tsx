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
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const commodityData = {
  Tomato: [
    { date: "Jan", actual: 42, predicted: 41, lower: 38, upper: 44 },
    { date: "Feb", actual: 38, predicted: 39, lower: 36, upper: 42 },
    { date: "Mar", actual: 45, predicted: 44, lower: 41, upper: 47 },
    { date: "Apr", actual: 52, predicted: 50, lower: 47, upper: 53 },
    { date: "May", actual: 48, predicted: 49, lower: 46, upper: 52 },
    { date: "Jun", actual: 44, predicted: 45, lower: 42, upper: 48 },
    { date: "Jul", actual: null, predicted: 47, lower: 43, upper: 51 },
    { date: "Aug", actual: null, predicted: 52, lower: 48, upper: 56 },
    { date: "Sep", actual: null, predicted: 55, lower: 50, upper: 60 },
  ],
  Onion: [
    { date: "Jan", actual: 28, predicted: 29, lower: 26, upper: 32 },
    { date: "Feb", actual: 32, predicted: 31, lower: 28, upper: 34 },
    { date: "Mar", actual: 35, predicted: 34, lower: 31, upper: 37 },
    { date: "Apr", actual: 30, predicted: 32, lower: 29, upper: 35 },
    { date: "May", actual: 34, predicted: 33, lower: 30, upper: 36 },
    { date: "Jun", actual: 32, predicted: 32, lower: 29, upper: 35 },
    { date: "Jul", actual: null, predicted: 35, lower: 31, upper: 39 },
    { date: "Aug", actual: null, predicted: 38, lower: 34, upper: 42 },
    { date: "Sep", actual: null, predicted: 42, lower: 37, upper: 47 },
  ],
  Potato: [
    { date: "Jan", actual: 25, predicted: 26, lower: 23, upper: 29 },
    { date: "Feb", actual: 27, predicted: 26, lower: 23, upper: 29 },
    { date: "Mar", actual: 24, predicted: 25, lower: 22, upper: 28 },
    { date: "Apr", actual: 28, predicted: 27, lower: 24, upper: 30 },
    { date: "May", actual: 30, predicted: 29, lower: 26, upper: 32 },
    { date: "Jun", actual: 28, predicted: 29, lower: 26, upper: 32 },
    { date: "Jul", actual: null, predicted: 31, lower: 27, upper: 35 },
    { date: "Aug", actual: null, predicted: 29, lower: 25, upper: 33 },
    { date: "Sep", actual: null, predicted: 27, lower: 23, upper: 31 },
  ],
};

const commodityOptions = [
  { name: "Tomato", icon: "🍅" },
  { name: "Onion", icon: "🧅" },
  { name: "Potato", icon: "🥔" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-xl p-4 shadow-lg">
        <p className="font-display font-semibold text-foreground mb-2">{label}</p>
        {data.actual !== null && (
          <div className="flex items-center gap-2 text-sm mb-1">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Actual:</span>
            <span className="font-medium text-foreground">₹{data.actual}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm mb-1">
          <span className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-muted-foreground">Predicted:</span>
          <span className="font-medium text-foreground">₹{data.predicted}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          Range: ₹{data.lower} - ₹{data.upper}
        </div>
      </div>
    );
  }
  return null;
};

export function PredictionChart() {
  const [selectedCommodity, setSelectedCommodity] = useState("Tomato");
  const data = commodityData[selectedCommodity as keyof typeof commodityData];

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
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {commodityOptions.map((commodity) => (
            <Button
              key={commodity.name}
              variant={selectedCommodity === commodity.name ? "hero" : "glass"}
              size="lg"
              onClick={() => setSelectedCommodity(commodity.name)}
              className="gap-2"
            >
              <span className="text-lg">{commodity.icon}</span>
              {commodity.name}
            </Button>
          ))}
        </div>

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
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
          </div>

          {/* Prediction Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Model Accuracy</p>
              <p className="font-display text-2xl font-bold text-primary">95.2%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">MAE (Mean Abs. Error)</p>
              <p className="font-display text-2xl font-bold text-foreground">₹2.34</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Next Day Forecast</p>
              <p className="font-display text-2xl font-bold text-secondary">₹{data[6].predicted}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Trend (7 days)</p>
              <p className="font-display text-2xl font-bold text-price-up">↑ +8.5%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
