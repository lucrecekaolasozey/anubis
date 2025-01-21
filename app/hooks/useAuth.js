import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useWallet } from "../components/WalletContext";
import { toast } from "react-toastify";

export function useAuth() {
  const { login, logout, ready, user } = usePrivy();
  const { walletAddress, setWalletAddress } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null - пока не определено

  useEffect(() => {
    if (!ready) {
      console.log("Privy is not ready yet.");
      return;
    }

    if (user?.wallet?.address) {
      console.log("Setting wallet address:", user.wallet.address);
      setWalletAddress(user.wallet.address);
      setIsAuthenticated(true); // Пользователь авторизован
    } else {
      console.log("Clearing wallet address and auth state.");
      setWalletAddress(null);
      setIsAuthenticated(false); // Пользователь не авторизован
    }
  }, [user, ready, setWalletAddress]);

  const handleLogin = async () => {
    try {
      await login();
      if (user?.wallet?.address) {
        toast.success("Successfully connected!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        console.log("User logged in successfully:", user?.id);
      } else {
        toast.error("No wallet address found. Please try again.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Failed to connect. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setWalletAddress(null);
      setIsAuthenticated(false);

      toast.info("You have been disconnected. Redirecting to home...", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to disconnect. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return {
    userId: user?.id || null,
    walletAddress: walletAddress || null,
    isAuthenticated: ready && isAuthenticated !== null ? isAuthenticated : null, // Гарантируем корректное состояние
    ready,
    handleLogin,
    handleLogout,
  };
}
