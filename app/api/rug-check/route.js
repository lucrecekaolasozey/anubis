import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      console.error("Token address is missing in the request.");
      return new Response(
        JSON.stringify({ error: "Token address is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Логируем начальный адрес
    console.log("Received address:", address);

    // Запрос к DexScreener
    console.log("Fetching data from DexScreener...");
    const dexResponse = await axios.get(
      `https://api.dexscreener.com/latest/dex/search/?q=${address}`
    );

    const dexPairs = dexResponse.data.pairs || [];
    console.log("DexScreener response pairs:", dexPairs);

    if (dexPairs.length === 0) {
      console.error("No data found in DexScreener for the given address.");
      return new Response(
        JSON.stringify({ error: "No data found for this token" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Обработка данных DexScreener
    const dexData = dexPairs.map((pair) => ({
      name: pair.baseToken.name,
      symbol: pair.baseToken.symbol,
      marketCap: pair.marketCap || null,
      liquidity: pair.liquidity?.usd || 0,
      boosts: pair.boosts?.active || 0,
      volumes: {
        "5m": pair.volume?.m5 || 0,
        "1h": pair.volume?.h1 || 0,
        "24h": pair.volume?.h24 || 0,
      },
      txns: {
        "5m": pair.txns?.m5 || {},
        "1h": pair.txns?.h1 || {},
        "24h": pair.txns?.h24 || {},
      },
      socials: pair.info?.socials || [],
      image: pair.info?.imageUrl || null,
      pairCreatedAt: pair.pairCreatedAt
        ? new Date(pair.pairCreatedAt).toLocaleDateString()
        : "Unknown",
    }));

    console.log("Mapped DexScreener data:", dexData);

    // Запрос к GoPlus API
    console.log("Fetching GoPlus security data for address:", address);
    const goplusResponse = await axios.get(
      `https://api.gopluslabs.io/api/v1/token_security/8453?contract_addresses=${address}`
    );

    console.log("GoPlus API response:", goplusResponse.data);

    const goplusData =
      goplusResponse.data.result?.[address.toLowerCase()] || null;

    if (!goplusData) {
      console.error(
        "No security data found in GoPlus for the given token address."
      );
      return new Response(
        JSON.stringify({
          error: "No security data found for the provided token address.",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Объединяем данные из DexScreener и GoPlus
    const responseData = {
      dexData,
      goplusData,
    };

    console.log("Combined response data:", responseData);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/rug-check:", error.message);
    console.error("Full error details:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch token data" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
