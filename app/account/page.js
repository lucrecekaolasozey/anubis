"use client";

import Portfolio from "../components/Portfolio";
import { useWallet } from "../components/WalletContext";

export default function AccountPage() {
  const { walletAddress } = useWallet();

  return (
    <div className="flex flex-col lg:flex-row h-full bg-baseDark text-foreground">
      {/* Основная зона (левая колонка) */}
      <div className="flex-grow bg-baseGray p-8 lg:rounded-l-lg shadow-lg">
        <h1 className="text-4xl font-extrabold">Account Overview</h1>
        <p className="mt-4 text-gray-300 text-lg">
          Manage your account settings and view detailed information about your activity.
        </p>

        <div className="mt-8 bg-baseAccent p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Account Details</h2>
          <p>
            <span className="font-bold text-gray-400">Wallet Address:</span>{" "}
            {walletAddress || "Not connected"}
          </p>
          <p className="mt-2">
            <span className="font-bold text-gray-400">Status:</span>{" "}
            {walletAddress ? (
              <span className="text-green-400">Connected</span>
            ) : (
              <span className="text-red-400">Not connected</span>
            )}
          </p>
        </div>

        <div className="mt-6">
        </div>
      </div>

      {/* Портфолио (правая колонка) */}
      <div className="w-full lg:w-1/3 bg-baseAccent p-6 lg:rounded-r-lg shadow-lg">
        {walletAddress ? (
          <Portfolio walletAddress={walletAddress} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-300 text-lg">Please connect your wallet to see your portfolio.</p>
          </div>
        )}
      </div>
    </div>
  );
}
