import { pool } from "../../../lib/db"; // Подключение к базе данных

import axios from "axios";

const CLANKER_URL =
  "https://www.clanker.world/api/tokens?sort=desc&page=1&pair=all&partner=all&presale=all";

/**
 * Функция для получения данных о создателе токена
 */
async function fetchUserData(fid) {
  if (!fid) return null;

  const url = `https://client.warpcast.com/v2/user?fid=${fid}`;
  try {
    const response = await axios.get(url);
    const user = response.data?.result?.user;
    if (!user) return null;

    return {
      username: user.username || "Unknown",
      followerCount: user.followerCount || 0,
      twitterUsername:
        user.connectedAccounts?.find(
          (acc) => acc.platform === "x" && !acc.expired
        )?.username || null,
    };
  } catch (error) {
    console.error(`Error fetching user data (fid=${fid}):`, error.message);
    return null;
  }
}

/**
 * Обновление базы данных с Clanker API
 */
async function updateDatabase() {
  try {
    const response = await axios.get(CLANKER_URL);
    const tokens = response.data?.data || [];

    for (const token of tokens) {
      const { contract_address: contractAddress, name, symbol, img_url: imgUrl, requestor_fid } =
        token;

      // Проверяем, существует ли токен в базе данных
      const exists = await pool.query(
        "SELECT * FROM messages WHERE contract_address = $1",
        [contractAddress]
      );

      if (exists.rows.length === 0) {
        // Получаем данные о создателе токена
        const creatorData = await fetchUserData(requestor_fid);

        // Добавляем новый токен в таблицу `messages`
        await pool.query(
          `INSERT INTO messages (content, token_name, contract_address, creator_username, follower_count, twitter_username, image_url, timestamp) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [
            `New listing: ${name || "No Name"} (${symbol || "No Symbol"})`,
            name || "No Name",
            contractAddress,
            creatorData?.username || "Unknown",
            creatorData?.followerCount || 0,
            creatorData?.twitterUsername || null,
            imgUrl || null,
          ]
        );
      }
    }

    console.log("Database updated successfully.");
  } catch (error) {
    console.error("Error updating database:", error.message);
  }
}

/**
 * Обработчик GET-запросов.
 * Возвращает данные из таблицы `messages`.
 */
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM messages ORDER BY timestamp DESC");
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    return new Response(
      JSON.stringify({ error: "Error fetching messages" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * Обработчик POST-запросов.
 * Запускает обновление базы данных с Clanker API.
 */
export async function POST() {
  try {
    await updateDatabase();
    return new Response(
      JSON.stringify({ message: "Tokens processed successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing tokens:", error.message);
    return new Response(
      JSON.stringify({ error: "Error processing tokens" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * Устанавливаем периодическое обновление каждые 20 секунд.
 */
setInterval(updateDatabase, 20000);
