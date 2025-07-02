import { corsHeaders } from "@shared/cors.ts";
import { clearAllMockData } from "@shared/test-utils.ts";

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, message: "Method not allowed" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 405,
        },
      );
    }

    const result = await clearAllMockData();

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error("Error in clear-mock-data:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        error: "Error processing request",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
