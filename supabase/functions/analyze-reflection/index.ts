import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reflection } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!reflection || reflection.trim().length === 0) {
      throw new Error("Reflection text is required");
    }

    console.log("Analyzing reflection:", reflection.substring(0, 100) + "...");

    const systemPrompt = `You are an AI wellness and productivity analyst for WorkSense AI. Analyze the user's daily work reflection and provide structured insights.

Your response MUST be a valid JSON object with this exact structure:
{
  "burnoutRisk": {
    "level": "low" | "medium" | "high",
    "percentage": number (0-100),
    "explanation": "brief explanation of the risk assessment"
  },
  "insights": [
    {
      "text": "insight text",
      "type": "info" | "warning" | "suggestion" | "insight",
      "icon": "TrendingUp" | "Calendar" | "AlertTriangle" | "Lightbulb"
    }
  ],
  "productivityScore": number (0-100),
  "summary": "A brief 1-2 sentence summary of the analysis"
}

Guidelines:
- Assess burnout risk based on workload mentions, stress indicators, work-life balance, and emotional tone
- Generate 3-5 actionable insights based on the reflection
- Be empathetic but professional
- Focus on constructive suggestions`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Analyze this daily work reflection:\n\n"${reflection}"`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limit exceeded. Please try again in a moment.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "Usage limit reached. Please add credits to continue.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    console.log("AI response:", content);

    // Parse the JSON from the response
    let analysis;
    try {
      // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch =
        content.match(/```json\n?([\s\S]*?)\n?```/) ||
        content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      analysis = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Provide a default response if parsing fails
      analysis = {
        burnoutRisk: {
          level: "medium",
          percentage: 50,
          explanation:
            "Unable to fully analyze. Please provide more details about your workday.",
        },
        insights: [
          {
            text: "Consider sharing more details about your work challenges",
            type: "suggestion",
            icon: "Lightbulb",
          },
        ],
        productivityScore: 50,
        summary: "Analysis completed with limited information.",
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-reflection:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
