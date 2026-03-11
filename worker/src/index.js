export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      const apiKey = env.GEMINI_API_KEY;

      if (!apiKey) {
        return new Response(JSON.stringify({ error: "Gemini API Key is not configured on the server." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // The client calls the worker with the same path it would call the Gemini API
      // e.g. /v1beta/models/gemini-2.0-flash-lite:generateContent
      const url = new URL(request.url);
      
      // Default to flash-lite if the root path is requested (for backward compatibility if needed)
      const targetPath = url.pathname === '/' ? '/v1beta/models/gemini-2.0-flash-lite:generateContent' : url.pathname;

      const geminiUrl = `https://generativelanguage.googleapis.com${targetPath}?key=${apiKey}`;

      const geminiResponse = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const responseData = await geminiResponse.json();

      return new Response(JSON.stringify(responseData), {
        status: geminiResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
