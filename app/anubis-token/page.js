"use client";

export default function AnubisTokenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-baseGray text-gray-100 p-6">
      {/* Заголовок */}
      <h1 className="text-4xl font-extrabold mb-8 text-white">Anubis Token</h1>

      {/* Основной блок */}
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl max-w-4xl text-center space-y-6">
        {/* Изображение */}
        <div>
          <img
            src="/binary_anubis.png" // Путь к изображению из папки public
            alt="Anubis Token"
            className="w-64 h-64 object-contain mx-auto"
          />
        </div>

        {/* Описание токена */}
        <h2 className="text-2xl font-bold text-gray-200">What is Anubis Token?</h2>
        <p className="text-gray-300 text-lg leading-relaxed">
          The Anubis Token is the native cryptocurrency powering our platform. It provides utility,
          governance, and rewards for active participants in the ecosystem.
        </p>

        {/* Основные возможности */}
        <div className="text-left space-y-4">
          <h3 className="text-xl font-bold text-gray-200">Links.</h3>
          <div className="space-y-2">
            <p>
              Creator Bid link: soon.
            </p>
          </div>
        </div>

        {/* Токеномика */}
        <div className="text-left space-y-4">
        </div>
      </div>
    </div>
  );
}
