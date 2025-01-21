import fetch from "node-fetch";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const type = searchParams.get("type"); // "info" или "holders"

  // Проверяем валидность адреса
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return new Response(JSON.stringify({ error: "Invalid Ethereum address" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Формируем URL в зависимости от типа запроса
    const endpoint =
      type === "holders"
        ? `/holders`
        : "";

    const url = `https://base.blockscout.com/api/v2/tokens/${address}${endpoint}`;

    // Делаем запрос к внешнему API
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch data from BlockScout" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Возвращаем данные
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching token data:", error.message);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
