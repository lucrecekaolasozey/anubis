import fetch from "node-fetch";

export async function GET(req, { params }) {
  const { address } = params;

  // Проверяем, является ли адрес валидным Ethereum-адресом
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return new Response(
      JSON.stringify({ error: "Invalid Ethereum address. Please check your input." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Запрос к BlockScout для получения списка холдеров
    const response = await fetch(`https://base.blockscout.com/api/v2/tokens/${address}/holders`);
    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch holders info from BlockScout." }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching holders:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error. Please try again later." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
