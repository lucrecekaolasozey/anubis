"use client";

export default function DocsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-baseGray text-gray-100 p-6 overflow-auto scrollbar-custom mt-2">
      {/* Заголовок страницы */}
      <h1 className="text-4xl font-extrabold text-white mb-8">Documentation</h1>

      {/* Основной контент */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-5xl text-left space-y-8 mb-4">
        {/* Введение */}
        <div>
          <h2 className="text-2xl font-bold text-gray-200 mb-2">Introduction</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Welcome to the Anubis documentation page. This guide will help you understand how to use
            the key features of our platform, including Clankerius, Rug Checker, and Account
            Portfolio tools.
          </p>
        </div>

        {/* Clankerius */}
        <div>
          <h2 className="text-2xl font-bold text-blue-400 mb-2">Clankerius</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            Clankerius is a powerful tool for exploring real-time token listings and updates on the
            blockchain. With Clankerius, you can:
          </p>
          <ul className="list-disc pl-6 text-gray-300 mt-2">
            <li>Monitor live token activity with detailed metrics.</li>
            <li>Chat with AI for insights about tokens, projects, and the market.</li>
            <li>Analyze historical data and trends for specific tokens.</li>
          </ul>
          <p className="text-gray-300 mt-2">
            Clankerius is designed to be your go-to assistant for all things related to blockchain
            tokens and analytics.
          </p>
        </div>

        {/* Rug Checker */}
        <div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Rug Checker</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            The Rug Checker is a security tool that helps you assess the safety of a token. By
            entering a token address, you can:
          </p>
          <ul className="list-disc pl-6 text-gray-300 mt-2">
            <li>Identify potential risks, such as honeypots or blacklisted tokens.</li>
            <li>Analyze token holders and their distribution.</li>
            <li>View social media mentions for the token to gauge popularity and sentiment.</li>
          </ul>
          <p className="text-gray-300 mt-2">
            Rug Checker leverages cutting-edge data sources to provide accurate and reliable
            assessments, helping you avoid risky investments.
          </p>
        </div>

        {/* Account Portfolio */}
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Account Portfolio</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            The Account Portfolio is your personalized dashboard for managing your blockchain
            interactions. With this tool, you can:
          </p>
          <ul className="list-disc pl-6 text-gray-300 mt-2">
            <li>View your wallet address and current balance.</li>
            <li>Track your activity across the platform.</li>
            <li>Connect and disconnect your wallet securely.</li>
          </ul>
          <p className="text-gray-300 mt-2">
            The Account Portfolio is designed to simplify your experience, giving you quick access
            to your blockchain data and transactions.
          </p>
        </div>
      </div>
    </div>
  );
}
