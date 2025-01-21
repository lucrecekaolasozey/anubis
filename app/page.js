"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const authMessage = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_message="))
      ?.split("=")[1];

    if (authMessage) {
      alert(decodeURIComponent(authMessage));
      document.cookie = "auth_message=; Max-Age=0; path=/";
    }
  }, []);

  const cards = [
    {
      id: 1,
      title: "Feed. SOON.",
      description: "Stay updated with the latest activity and agent updates.",
      logo: "/feed-logo.png",
      link: "/",
    },
    {
      id: 2,
      title: "Clanker listings and AI Chat.",
      description: "Explore real-time token listings and updates, also you can chat with AI.",
      logo: "/clanker-logo.png",
      link: "/clankerius",
    },
    {
      id: 3,
      title: "Anubis Token",
      description: "Learn more about Anubis Token.",
      logo: "/anubis_ascii.png",
      link: "/anubis-token",
    },
    {
      id: 4,
      title: "Rug Checker",
      description: "Analyze a token to determine its risk of being a rug pull on Base chain.",
      logo: "/rug-checker.jpg",
      link: "/rug-checker",
    },
    {
      id: 5,
      title: "Binary Generation. SOON.",
      description: "Generate ASCII art from images with a click.",
      logo: "binary_anubis.png",
      link: "/",
    },
    {
      id: 6,
      title: "Anubis Launchpad. SOON.",
      description: "Launch your own AI Agents with custom settings.",
      logo: "/avatar.png",
      link: "/",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-baseGray p-8">
      <h1 className="text-3xl font-bold mb-8 text-baseText">Welcome to Anubis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
          key={card.id}
          className="bg-gradient-to-br from-baseGray via-baseAccent to-baseDark p-6 rounded-lg shadow-lg flex flex-col items-start space-y-4 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
          onClick={() => card.link && router.push(card.link)}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
            <img
              src={card.logo}
              alt={card.title}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h2 className="text-2xl font-bold text-white">{card.title}</h2>
          <p className="text-sm text-gray-300">{card.description}</p>
        </div>
        
        ))}
      </div>
    </div>
  );
}
