import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch current commodity data for context
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: commodities } = await supabase
      .from("commodities")
      .select("name, icon, unit");

    const { data: priceData } = await supabase
      .from("price_data")
      .select("price, mandi_name, recorded_at, commodities(name)")
      .order("recorded_at", { ascending: false })
      .limit(30);

    const { data: predictions } = await supabase
      .from("predictions")
      .select("predicted_price, prediction_date, confidence_score, commodities(name)")
      .order("prediction_date", { ascending: true })
      .limit(20);

    const priceContext = priceData?.map(p => 
      `${(p.commodities as any)?.name}: ₹${p.price} at ${p.mandi_name}`
    ).join("\n") || "No price data available";

    const predictionContext = predictions?.map(p => 
      `${(p.commodities as any)?.name}: ₹${p.predicted_price} predicted for ${p.prediction_date} (${((p.confidence_score || 0) * 100).toFixed(0)}% confidence)`
    ).join("\n") || "No predictions available";

    const systemPrompt = `You are AgriPrice AI, an intelligent agricultural market assistant for Indian farmers and traders. You help users with:

1. **Current Market Prices**: Provide real-time commodity prices from various mandis across India
2. **Price Predictions**: Share LSTM model predictions with confidence scores
3. **Market Insights**: Offer advice on when to buy/sell based on trends
4. **Storage Tips**: Guidance on storing vegetables to maximize shelf life
5. **Arbitrage Opportunities**: Identify price differences between mandis

**Current Market Data:**
${priceContext}

**Price Predictions:**
${predictionContext}

**Guidelines:**
- Be helpful, concise, and farmer-friendly
- Use simple language, avoiding jargon
- Always quote prices in Indian Rupees (₹)
- When uncertain, acknowledge limitations
- Encourage users to verify critical decisions with local market experts
- Support Hindi/English code-switching naturally
- Format responses with emojis for better readability
- Use markdown tables when comparing multiple prices`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
