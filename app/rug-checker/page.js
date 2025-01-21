"use client";

import { useState } from "react";
import axios from "axios";

export default function RugCheckerPage() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    setError("");
    setResult(null);

    if (!address.trim()) {
      setError("Please enter a valid token address.");
      return;
    }

    try {
      // Запрос данных от основного API Rug Checker
      const response = await axios.get(`/api/rug-check?address=${address}`);
      const goPlusData = response.data;

      setResult({
        ...goPlusData,
      });
    } catch (err) {
      console.error("Error fetching token data:", err.message);
      setError(err.response?.data?.error || "An unexpected error occurred.");
    }
  };

  const renderCheckmark = (value) => {
    return value === "1" || value === true ? (
      <span className="text-green-500">✅</span>
    ) : (
      <span className="text-red-500">❌</span>
    );
  };

  return (
    <div className="min-h-screen bg-baseGray text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Rug Checker</h1>
      <p className="text-gray-400 mb-6">
        Enter the token address below to analyze its safety and holders.
      </p>
      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter token address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input p-2 rounded bg-baseAccent text-white mb-4 w-full max-w-lg"
        />
        <button
          onClick={handleCheck}
          className="bg-blue hover:bg-blue-hover text-white font-bold py-2 px-4 rounded"
        >
          Check Token
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 w-full max-w-6xl bg-baseDark rounded shadow-lg grid grid-cols-3 gap-6 p-6">
          {/* Холдеры */}
          <div className="col-span-2 bg-baseGray rounded p-4 overflow-hidden max-h-96">
            <h2 className="text-xl font-bold mb-4">Top Holders:</h2>
            {result.goplusData?.holders?.map((holder, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 border-b border-gray-700"
              >
                <span className="break-words w-full">{holder.address}</span>
                <span className="w-1/4 text-right">
  {holder.balance ? parseFloat(holder.balance).toFixed(1) : "0.0"}
</span>
                <span className="w-1/4 text-right">
                  {(holder.percent * 100).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>

          {/* Security Details */}
          <div className="bg-baseGray rounded p-4">
            <h2 className="text-xl font-bold mb-4">Security Details:</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Anti-Whale:</span>
                <span>{renderCheckmark(result.goplusData?.is_anti_whale)}</span>
              </div>
              <div className="flex justify-between">
                <span>Honeypot:</span>
                <span>{renderCheckmark(result.goplusData?.is_honeypot)}</span>
              </div>
              <div className="flex justify-between">
                <span>Mintable:</span>
                <span>{renderCheckmark(result.goplusData?.is_mintable)}</span>
              </div>
              <div className="flex justify-between">
                <span>Open Source:</span>
                <span>{renderCheckmark(result.goplusData?.is_open_source)}</span>
              </div>
              <div className="flex justify-between">
                <span>Blacklisted:</span>
                <span>{renderCheckmark(result.goplusData?.is_blacklisted)}</span>
              </div>
              <div className="flex justify-between">
                <span>Buy Tax:</span>
                <span>{result.goplusData?.buy_tax || "N/A"}%</span>
              </div>
              <div className="flex justify-between">
                <span>Sell Tax:</span>
                <span>{result.goplusData?.sell_tax || "N/A"}%</span>
              </div>
              <div className="flex justify-between">
                <span>Total Supply:</span>
                <span>{result.goplusData?.total_supply || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
