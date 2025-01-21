import { pool } from "../../../lib/db"; // Подключение к базе данных

// Создание сообщения
export async function POST(req) {
  try {
    const { chatId, isUser, text } = await req.json();
    console.log("Saving message:", { chatId, isUser, text });
    if (!chatId || typeof isUser !== "boolean" || !text) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO chat_messages (chat_id, is_user, text) VALUES ($1, $2, $3) RETURNING id`,
      [chatId, isUser, text]
    );

    return new Response(JSON.stringify({ messageId: rows[0].id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving message:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Получение сообщений из чата
export async function GET(req) {
  const chatId = req.headers.get("chat-id");
  if (!chatId) {
    console.error("Chat ID is missing");
    return new Response(JSON.stringify({ error: "Chat ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { rows } = await pool.query(
      `SELECT * FROM chat_messages WHERE chat_id = $1 ORDER BY created_at ASC`,
      [chatId]
    );
    console.log("Messages fetched from DB:", rows); // Проверьте, что поле is_user возвращается корректно
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

