import { createContext, useContext, useState } from "react";

const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);

  // API-вызов с передачей walletAddress в заголовке
  const apiCallWithWallet = async (url, method, body = null) => {
    const headers = {
      "Content-Type": "application/json",
      "wallet-address": walletAddress || "", // Передаем адрес кошелька
    };

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    return response.json();
  };

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress, apiCallWithWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
