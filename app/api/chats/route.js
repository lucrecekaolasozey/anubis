import { pool } from "../../../lib/db"; // Подключение к базе данных


// Создание чата
export async function POST(req) {
  try {
    const { userId, chatName } = await req.json();
    const walletAddress = req.headers.get("wallet-address");

    console.log("POST Request Received:");
    console.log("Headers:", { walletAddress });
    console.log("Body:", { userId, chatName });

    // Проверка на наличие обязательных полей
    if (!userId || !chatName || !walletAddress) {
      console.error("Missing fields:", { userId, chatName, walletAddress });
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Проверяем, существует ли уже чат с таким названием для пользователя
    const existingChat = await pool.query(
      `SELECT id FROM chats WHERE user_id = $1 AND chat_name = $2 AND wallet_address = $3`,
      [userId, chatName, walletAddress]
    );

    console.log("Existing Chat Query Result:", existingChat.rows);

    if (existingChat.rows.length > 0) {
      console.error("Chat with this name already exists:", {
        userId,
        chatName,
        walletAddress,
      });
      return new Response(
        JSON.stringify({ error: "Chat with this name already exists" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Вставка нового чата в базу данных
    const { rows } = await pool.query(
      `INSERT INTO chats (user_id, chat_name, wallet_address) VALUES ($1, $2, $3) RETURNING id, created_at`,
      [userId, chatName, walletAddress]
    );

    console.log("Chat Inserted:", rows[0]);

    return new Response(
      JSON.stringify({
        chatId: rows[0].id,
        createdAt: rows[0].created_at,
        message: "Chat created successfully",
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating chat:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(req) {
  try {
    const chatId = req.headers.get("chat-id");
    const userId = req.headers.get("user-id");
    const walletAddress = req.headers.get("wallet-address");

    console.log("DELETE Request Received:");
    console.log("Headers:", { chatId, userId, walletAddress });

    if (!chatId || !userId || !walletAddress) {
      console.error("Missing required headers:", { chatId, userId, walletAddress });
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Проверяем, принадлежит ли чат пользователю
    const { rowCount } = await pool.query(
      `DELETE FROM chats WHERE id = $1 AND user_id = $2 AND wallet_address = $3`,
      [chatId, userId, walletAddress]
    );

    if (rowCount === 0) {
      console.error("Chat not found or does not belong to user");
      return new Response(
        JSON.stringify({ error: "Chat not found or access denied" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Удаляем связанные сообщения
    await pool.query(`DELETE FROM chat_messages WHERE chat_id = $1`, [chatId]);

    console.log(`Chat ${chatId} and related messages deleted`);
    return new Response(
      JSON.stringify({ message: "Chat and messages deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting chat:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Получение списка чатов для пользователя
export async function GET(req) {
  const userId = req.headers.get("user-id");
  const walletAddress = req.headers.get("wallet-address");

  console.log("GET Request Received:");
  console.log("Headers:", { userId, walletAddress });

  // Проверка наличия обязательных заголовков
  if (!userId || !walletAddress) {
    console.error("Missing required headers:", { userId, walletAddress });
    return new Response(
      JSON.stringify({
        error: "User ID and Wallet Address are required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Получение списка чатов из базы данных
    const { rows } = await pool.query(
      `SELECT id, chat_name, created_at FROM chats WHERE user_id = $1 AND wallet_address = $2 ORDER BY created_at DESC`,
      [userId, walletAddress]
    );

    console.log("Chats Fetched:", rows);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching chats:", error.message);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
