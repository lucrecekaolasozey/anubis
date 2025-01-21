"use client";

import { useEffect, useState } from "react";

export default function Portfolio({ walletAddress }) {
  const [tokens, setTokens] = useState([]);
  const [lowValueTokens, setLowValueTokens] = useState(0);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          `https://base.blockscout.com/api/v2/addresses/${walletAddress}/token-balances`
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          const filteredTokens = [];
          let lowValueCount = 0;

          data.forEach((token) => {
            const usdValue = parseFloat(
              (token.value / Math.pow(10, token.token.decimals)) * token.token.exchange_rate
            );

            if (usdValue >= 1) {
              filteredTokens.push({ ...token, usdValue: usdValue.toFixed(2) });
            } else {
              lowValueCount++;
            }
          });

          setTokens(filteredTokens);
          setLowValueTokens(lowValueCount);
        } else {
          console.error("Error fetching tokens: Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching tokens:", error.message);
      }
    };

    if (walletAddress) {
      fetchTokens();
    }
  }, [walletAddress]);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Portfolio</h2>
      <div className="space-y-2">
        {tokens.map((token) => (
          <div key={token.token.address} className="bg-baseGray p-4 rounded shadow">
            <div className="flex items-center">
              <img
                src={token.token.icon_url}
                alt={token.token.name}
                className="w-8 h-8 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">{token.token.name}</p>
                <p className="text-sm text-baseText">
                  {parseFloat(token.value / Math.pow(10, token.token.decimals)).toFixed(2)}{" "}
                  {token.token.symbol}
                </p>
              </div>
              <p className="ml-auto font-bold text-baseAccent">${token.usdValue}</p>
            </div>
          </div>
        ))}
        {lowValueTokens > 0 && (
          <div className="bg-baseGray p-4 rounded shadow">
            <p className="text-sm text-baseText">
              and {lowValueTokens} token{lowValueTokens > 1 ? "s" : ""} with value &lt; $1
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
