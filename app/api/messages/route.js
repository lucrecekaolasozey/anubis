import { pool } from "../../../lib/db"; // Подключение к базе данных


export default async function handler(req, res) {
  if (req.method === "POST") {
    const { content, token_name, contract_address } = req.body;

    // Проверка обязательных полей
    if (!content || !token_name || !contract_address) {
      return res.status(400).json({ error: "All fields are required: content, token_name, contract_address" });
    }

    try {
      // Вставка сообщения в базу данных
      const result = await pool.query(
        `INSERT INTO messages (content, token_name, contract_address) 
         VALUES ($1, $2, $3) 
         RETURNING *`,
        [content, token_name, contract_address]
      );
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("❌ Error inserting message:", error.message);
      res.status(500).json({ error: "Error inserting message" });
    }
  } else if (req.method === "GET") {
    const { search } = req.query;

    try {
      // Поиск сообщений в базе данных
      const result = await pool.query(
        `SELECT * FROM messages 
         WHERE token_name ILIKE $1 
            OR contract_address ILIKE $1 
         ORDER BY timestamp DESC`,
        [`%${search || ""}%`]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("❌ Error fetching messages:", error.message);
      res.status(500).json({ error: "Error fetching messages" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
