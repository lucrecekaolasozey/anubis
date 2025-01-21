"use client";

import { AiFillHome, AiFillIdcard, AiFillFileText } from "react-icons/ai";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Sidebar() {
  const { userId, walletAddress, isAuthenticated, ready, handleLogin, handleLogout } = useAuth();
  const router = useRouter();

  const formatAddress = (address) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="sidebar bg-sidebar h-screen flex flex-col p-6 shadow-lg transition-all">
      {/* Логотип */}
      <div className="flex items-center justify-center mb-8">
        <img src="/logo.png" alt="Anubis Logo" className="w-40 h-auto rounded-full shadow-md" />
      </div>

      {/* Навигация */}
      <nav className="flex-grow">
        <ul className="space-y-6">
          <li>
            <button
              onClick={() => router.push("/")}
              className="sidebar-b flex items-center p-3 text-white hover:bg-blue-500 hover:shadow-lg rounded-lg transition-all"
            >
              <AiFillHome size={24} />
              <span className="ml-4 font-semibold">Home</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/account")}
              className="sidebar-b flex items-center p-3 text-white hover:bg-blue-500 hover:shadow-lg rounded-lg transition-all"
            >
              <AiFillIdcard size={24} />
              <span className="ml-4 font-semibold">Account</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push("/docs")}
              className="sidebar-b flex items-center p-3 text-white hover:bg-blue-500 hover:shadow-lg rounded-lg transition-all"
            >
              <AiFillFileText size={24} />
              <span className="ml-4 font-semibold">Docs</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Авторизация */}
      <div className="auth-section mt-6">
        {ready ? (
          isAuthenticated ? (
            <div className="text-sm text-gray-300 space-y-2">
              <p>
                <strong>User ID:</strong> {userId.slice(0, 6)}...
              </p>
              <p>
                <strong>Wallet:</strong> {formatAddress(walletAddress)}
              </p>
              <button
                onClick={async () => {
                  try {
                    await handleLogout();
                    toast.success("Successfully disconnected.", {
                      position: "top-center",
                      autoClose: 3000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      theme: "dark",
                    });
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
                }}
                className=" sidebar-b w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={async () => {
                try {
                  await handleLogin();
                  toast.success("Successfully connected.", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark",
                  });
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
              }}
              className="sidebar-b w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all"
            >
              Connect Wallet
            </button>
          )
        ) : (
          <p className="text-center text-gray-400">Loading...</p>
        )}
      </div>
    </div>
  );
}
