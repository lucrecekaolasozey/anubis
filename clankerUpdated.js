import pkg from "pg";
import axios from "axios";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "anubis_bd",
  password: "admin",
  port: 5432,
});

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
 * Функция для обновления токенов в базе данных
 */
async function updateTokens() {
  try {
    const response = await axios.get(CLANKER_URL);
    const tokens = response.data?.data ?? [];

    for (const token of tokens) {
      const contractAddress = token.contract_address;
      const tokenName = token.name || "No Name";
      const symbol = token.symbol || "No Symbol";
      const imgUrl = token.img_url || null;

      // Проверяем, существует ли токен в базе данных
      const checkExists = await pool.query(
        `SELECT * FROM messages WHERE contract_address = $1`,
        [contractAddress]
      );

      if (checkExists.rows.length === 0) {
        // Получаем данные о создателе токена
        const creatorData = await fetchUserData(token.requestor_fid);

        // Добавляем в базу данных новый токен
        await pool.query(
          `INSERT INTO messages (content, token_name, contract_address, creator_username, follower_count, twitter_username, image_url, timestamp) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
          [
            `New listing: ${tokenName} (${symbol})`,
            tokenName,
            contractAddress,
            creatorData?.username || "Unknown",
            creatorData?.followerCount || 0,
            creatorData?.twitterUsername || null,
            imgUrl,
          ]
        );

        console.log(`Added new token: ${tokenName} (${symbol})`);
      }
    }
  } catch (error) {
    console.error("Error updating tokens:", error.message);
  }
}

// Запускаем обновление каждые 20 секунд
setInterval(updateTokens, 20000);

console.log("Clanker Updater started, checking for updates every 20 seconds.");
