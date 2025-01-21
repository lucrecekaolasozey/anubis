"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import Sidebar from "./components/Sidebar";
import { WalletProvider } from "./components/WalletContext"; // Импорт WalletProvider
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
          config={{
            loginMethods: ["wallet"],
          }}
        >
          <WalletProvider>
            <div className="flex h-screen bg-baseGray text-baseText">
              <Sidebar />
              <div className="flex-grow p-8">{children}</div>
            </div>
            {/* Добавляем ToastContainer для уведомлений */}
            <ToastContainer position="top-center" autoClose={3000} />
          </WalletProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}
