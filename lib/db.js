const { Pool } = require("pg");

// Создаем пул соединений с базой данных
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Используем строку подключения из .env
  
  ssl: {
    rejectUnauthorized: false, // Обязательно для Railway
  },
});

// Логирование успешного подключения
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Успешное подключение к базе данных на Railway");
    client.release(); // Возвращаем клиент в пул после проверки
  } catch (err) {
    console.error("❌ Ошибка подключения к базе данных:", err.message);
  }
})();

// Тестовый запрос для проверки
(async () => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");
    console.log("🕒 Текущая дата/время из базы данных:", result.rows[0].current_time);
  } catch (err) {
    console.error("❌ Ошибка выполнения тестового запроса:", err.message);
  }
})();

module.exports = { pool };
