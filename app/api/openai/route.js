import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Убедитесь, что API-ключ настроен в .env
});

export async function POST(req) {
  try {
    const body = await req.json(); // Парсим JSON из тела запроса
    console.log("Request body:", body);

    const { message, context } = body;

    if (!message) {
      console.error("No message provided in request body.");
      return new Response(JSON.stringify({ error: "Message is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Убедимся, что context всегда массив
    const safeContext = Array.isArray(context) ? context : [];

    console.log("Sending request to OpenAI with message:", message);

    const openaiMessages = [
      {
        role: "system",
        content:
          "You are Clankerius, an AI assistant that provides detailed insights about tokens.",
      },
      ...safeContext.map((msg) => ({ role: msg.role, content: msg.content })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: openaiMessages,
    });

    console.log("OpenAI response received:", completion);

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      console.error("No reply received from OpenAI.");
      return new Response(
        JSON.stringify({ error: "No reply received from OpenAI." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Reply to return:", reply);

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error.message);
    console.error("Full error details:", error);

    return new Response(
      JSON.stringify({ error: "Error communicating with OpenAI" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Обработка других методов
export async function GET() {
  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
