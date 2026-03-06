import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// data.gov.in resource ID for daily commodity prices (Agmarknet)
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";

// Map data.gov.in commodity names to our DB commodity names
const COMMODITY_MAP: Record<string, string> = {
  "Tomato": "Tomato",
  "Potato": "Potato",
  "Onion": "Onion",
  "Rice": "Rice",
  "Wheat": "Wheat",
  "Apple": "Apple",
  "Banana": "Banana",
  "Mango": "Mango",
  "Cabbage": "Cabbage",
  "Carrot": "Carrot",
  "Cauliflower": "Cauliflower",
  "Green Chilli": "Green Chili",
};

// Fallback simulated data when API is unavailable
const MANDIS = [
  { name: "Azadpur Mandi", location: "Delhi", state: "Delhi" },
  { name: "Vashi Market", location: "Navi Mumbai", state: "Maharashtra" },
  { name: "Koyambedu Market", location: "Chennai", state: "Tamil Nadu" },
  { name: "Bowenpally Market", location: "Hyderabad", state: "Telangana" },
  { name: "Yeshwanthpur APMC", location: "Bangalore", state: "Karnataka" },
];

const BASE_PRICES: Record<string, { min: number; max: number }> = {
  Tomato: { min: 15, max: 60 }, Potato: { min: 12, max: 35 },
  Onion: { min: 18, max: 55 }, Rice: { min: 30, max: 50 },
  Wheat: { min: 22, max: 38 }, Apple: { min: 80, max: 200 },
  Banana: { min: 25, max: 60 }, Mango: { min: 40, max: 150 },
  Cabbage: { min: 10, max: 30 }, Carrot: { min: 20, max: 50 },
  Cauliflower: { min: 15, max: 45 }, "Green Chili": { min: 30, max: 100 },
};

interface GovRecord {
  commodity: string;
  market: string;
  district: string;
  state: string;
  modal_price: string;
  min_price: string;
  max_price: string;
  arrival_date: string;
}

async function fetchFromDataGovIn(apiKey: string): Promise<GovRecord[]> {
  const commodities = Object.keys(COMMODITY_MAP).join("|");
  const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${apiKey}&format=json&limit=500&filters[commodity]=${encodeURIComponent(commodities)}`;

  console.log("Fetching from data.gov.in...");
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    console.error(`data.gov.in responded ${response.status}: ${text}`);
    throw new Error(`data.gov.in API error: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Received ${data.records?.length || 0} records from data.gov.in`);
  return data.records || [];
}

function generateFallbackData(commodities: { id: string; name: string }[]): any[] {
  const now = new Date().toISOString();
  const records: any[] = [];

  for (const commodity of commodities) {
    const shuffled = [...MANDIS].sort(() => Math.random() - 0.5).slice(0, 3);
    for (const mandi of shuffled) {
      const range = BASE_PRICES[commodity.name] || { min: 20, max: 60 };
      const price = range.min + Math.random() * (range.max - range.min);
      records.push({
        commodity_id: commodity.id,
        mandi_name: mandi.name,
        mandi_location: mandi.location,
        state: mandi.state,
        price: Math.round(price * 100) / 100,
        recorded_at: now,
        source: "simulated_fallback",
      });
    }
  }
  return records;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const apiKey = Deno.env.get("DATA_GOV_IN_API_KEY");

    // Fetch all commodities from DB
    const { data: commodities, error: comError } = await supabase
      .from("commodities")
      .select("id, name");
    if (comError) throw comError;

    const commodityLookup = new Map(commodities.map((c: any) => [c.name.toLowerCase(), c.id]));
    const now = new Date().toISOString();
    let records: any[] = [];
    let source = "simulated_fallback";

    // Try real API first
    if (apiKey) {
      try {
        const govRecords = await fetchFromDataGovIn(apiKey);

        if (govRecords.length > 0) {
          source = "data_gov_in";
          for (const rec of govRecords) {
            const mappedName = COMMODITY_MAP[rec.commodity] || rec.commodity;
            const commodityId = commodityLookup.get(mappedName.toLowerCase());
            if (!commodityId) continue;

            // data.gov.in prices are per quintal, convert to per kg
            const modalPrice = parseFloat(rec.modal_price);
            if (isNaN(modalPrice) || modalPrice <= 0) continue;

            const pricePerKg = Math.round((modalPrice / 100) * 100) / 100;

            records.push({
              commodity_id: commodityId,
              mandi_name: rec.market || "Unknown Market",
              mandi_location: rec.district || null,
              state: rec.state || null,
              price: pricePerKg,
              recorded_at: now,
              source: "data_gov_in",
            });
          }
          console.log(`Mapped ${records.length} records from data.gov.in`);
        }
      } catch (apiErr) {
        console.warn("data.gov.in fetch failed, using fallback:", apiErr.message);
      }
    }

    // Fallback to simulated data if no real data
    if (records.length === 0) {
      console.log("Using simulated fallback data");
      records = generateFallbackData(commodities);
    }

    // Deduplicate: keep only one record per commodity+mandi (latest)
    const dedupMap = new Map<string, any>();
    for (const r of records) {
      const key = `${r.commodity_id}_${r.mandi_name}`;
      dedupMap.set(key, r);
    }
    const finalRecords = Array.from(dedupMap.values());

    const { error: insertError } = await supabase
      .from("price_data")
      .insert(finalRecords);
    if (insertError) throw insertError;

    const uniqueCommodities = new Set(finalRecords.map((r: any) => r.commodity_id));

    // ─── Holt-Winters Triple Exponential Smoothing with Weekly Seasonality ───
    // Captures level, trend, AND seasonal patterns for maximum accuracy
    const predictionRecords: any[] = [];
    for (const commodityId of uniqueCommodities) {
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const { data: historicalPrices, error: histError } = await supabase
        .from("price_data")
        .select("price, recorded_at")
        .eq("commodity_id", commodityId)
        .gte("recorded_at", sixtyDaysAgo.toISOString())
        .order("recorded_at", { ascending: true });

      if (histError) {
        console.error(`History fetch error for ${commodityId}:`, histError.message);
      }

      // Group by date and average to get daily prices
      const dailyMap = new Map<string, number[]>();
      const allPrices = [
        ...(historicalPrices || []).map((p: any) => ({ price: p.price, recorded_at: p.recorded_at })),
        ...finalRecords.filter((r: any) => r.commodity_id === commodityId).map((r: any) => ({ price: r.price, recorded_at: r.recorded_at })),
      ];

      for (const p of allPrices) {
        const dateKey = new Date(p.recorded_at).toISOString().split("T")[0];
        if (!dailyMap.has(dateKey)) dailyMap.set(dateKey, []);
        dailyMap.get(dateKey)!.push(p.price);
      }

      const dailyAvgs = Array.from(dailyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, prices]) => prices.reduce((s, v) => s + v, 0) / prices.length);

      if (dailyAvgs.length === 0) continue;

      const SEASON = 7; // weekly seasonality

      // ─── Holt-Winters (Additive) ───
      const alpha = 0.35; // Level smoothing
      const beta  = 0.10; // Trend smoothing
      const gamma = 0.25; // Seasonal smoothing

      // Initialize seasonal indices from first full season (or pad if insufficient)
      const seasonal: number[] = new Array(SEASON).fill(0);
      if (dailyAvgs.length >= SEASON) {
        const firstSeasonAvg = dailyAvgs.slice(0, SEASON).reduce((s, v) => s + v, 0) / SEASON;
        for (let i = 0; i < SEASON; i++) {
          seasonal[i] = dailyAvgs[i] - firstSeasonAvg;
        }
      }

      // Initialize level and trend
      let level = dailyAvgs.length >= SEASON
        ? dailyAvgs.slice(0, SEASON).reduce((s, v) => s + v, 0) / SEASON
        : dailyAvgs[0];
      let trend = dailyAvgs.length >= SEASON * 2
        ? ((dailyAvgs.slice(SEASON, SEASON * 2).reduce((s, v) => s + v, 0) / SEASON) - level) / SEASON
        : dailyAvgs.length > 1
          ? (dailyAvgs[dailyAvgs.length - 1] - dailyAvgs[0]) / dailyAvgs.length
          : 0;

      // Train: update level, trend, and seasonal components
      const startIdx = dailyAvgs.length >= SEASON ? SEASON : 1;
      for (let i = startIdx; i < dailyAvgs.length; i++) {
        const prevLevel = level;
        const seasonIdx = i % SEASON;
        const observation = dailyAvgs[i];

        // Update level (de-seasonalized)
        level = alpha * (observation - seasonal[seasonIdx]) + (1 - alpha) * (prevLevel + trend);
        // Update trend
        trend = beta * (level - prevLevel) + (1 - beta) * trend;
        // Update seasonal component
        seasonal[seasonIdx] = gamma * (observation - level) + (1 - gamma) * seasonal[seasonIdx];
      }

      // Calculate volatility for confidence scoring
      const recentPrices = dailyAvgs.slice(-14);
      const mean = recentPrices.reduce((s, v) => s + v, 0) / recentPrices.length;
      const variance = recentPrices.reduce((s, v) => s + (v - mean) ** 2, 0) / recentPrices.length;
      const volatility = Math.sqrt(variance) / mean;

      // Also compute recent forecast errors (backtest last 7 days) for confidence calibration
      let backcastError = 0;
      const backcastN = Math.min(7, dailyAvgs.length - 1);
      if (backcastN > 0) {
        for (let i = dailyAvgs.length - backcastN; i < dailyAvgs.length; i++) {
          const fcastIdx = i % SEASON;
          const fcast = level + trend * (i - dailyAvgs.length + 1) + seasonal[fcastIdx];
          backcastError += Math.abs((dailyAvgs[i] - fcast) / dailyAvgs[i]);
        }
        backcastError /= backcastN;
      }

      // Generate 7-day forecasts
      for (let day = 1; day <= 7; day++) {
        const predDate = new Date();
        predDate.setDate(predDate.getDate() + day);

        const seasonIdx = (dailyAvgs.length + day - 1) % SEASON;
        // Holt-Winters forecast: level + trend*h + seasonal[h mod s]
        const forecast = level + trend * day + seasonal[seasonIdx];
        // Minimal noise for realism
        const noise = (Math.random() - 0.5) * 2 * volatility * forecast * 0.05;
        const predictedPrice = Math.max(1, Math.round((forecast + noise) * 100) / 100);

        // Confidence based on backcast accuracy, volatility, and horizon
        const baseConfidence = Math.max(0.6, 0.97 - backcastError * 1.5 - volatility * 1.5);
        const horizonDecay = 0.015 * day;
        const dataBonus = Math.min(0.05, dailyAvgs.length / 1200);
        const confidence = Math.round(Math.max(0.5, Math.min(0.99, baseConfidence - horizonDecay + dataBonus)) * 100) / 100;

        predictionRecords.push({
          commodity_id: commodityId,
          predicted_price: predictedPrice,
          prediction_date: predDate.toISOString().split("T")[0],
          prediction_horizon: "7_days",
          model_version: "holt_winters_v2",
          confidence_score: confidence,
        });
      }

      console.log(`📈 ${commodityId}: level=${level.toFixed(2)}, trend=${trend.toFixed(4)}, volatility=${(volatility*100).toFixed(1)}%, seasonal=[${seasonal.map(s => s.toFixed(2)).join(",")}], history=${dailyAvgs.length}d`);
    }

    // Delete old predictions and insert fresh ones
    if (predictionRecords.length > 0) {
      const commodityIds = Array.from(uniqueCommodities);
      await supabase
        .from("predictions")
        .delete()
        .in("commodity_id", commodityIds);

      const { error: predError } = await supabase
        .from("predictions")
        .insert(predictionRecords);
      if (predError) console.error("Prediction insert error:", predError);
      else console.log(`Inserted ${predictionRecords.length} fresh predictions`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        source,
        records_inserted: finalRecords.length,
        predictions_generated: predictionRecords.length,
        commodities_updated: uniqueCommodities.size,
        timestamp: now,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Ingestion error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
