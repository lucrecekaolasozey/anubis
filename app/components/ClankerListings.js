"use client";

import { useEffect, useState } from "react";

export default function ClankerListings() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Функция для получения данных
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/clanker");
        const data = await response.json();
        setMessages(data); // Обновляем сообщения
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Первый запуск
    fetchMessages();

    // Устанавливаем интервал на 20 секунд
    const interval = setInterval(fetchMessages, 20000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full p-2">
      <h1 className="text-3xl font-bold text-baseText mb-4">Clanker Listings</h1>

      {/* Состояние загрузки */}
      {isLoading && (
        <p className="text-baseAccent text-center mb-4">Updating listings...</p>
      )}

      {/* Диалог с ограничением скроллинга */}
      <div
        className="flex flex-col gap-4 bg-baseGray p-4 rounded-lg h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-start gap-4 p-4 bg-baseDark rounded-lg shadow-md"
          >
            {/* Аватар ANUBIS */}
            <div className="w-12 h-12 bg-baseAccent rounded-full flex items-center justify-center">
              <img
                src="/avatar.png" // Убедитесь, что изображение находится в папке public
                alt="Anubis Avatar"
                className="w-10 h-10 rounded-full"
              />
            </div>

            {/* Сообщение */}
            <div>
              <p className="text-baseText font-semibold">
                <span className="text-baseAccent">New Listing:</span>{" "}
                {message.token_name} ({message.contract_address}){" "}
                <a
                  href={`https://clanker.world/clanker/${message.contract_address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-baseAccent hover:underline"
                >
                  [View Contract]
                </a>
              </p>

              {/* Данные о создателе */}
              {message.creator_username ? (
                <p className="text-baseText mt-2">
                  <span className="font-semibold">Creator:</span>{" "}
                  <a
                    href={`https://warpcast.com/${message.creator_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-baseAccent hover:underline"
                  >
                    {message.creator_username}
                  </a>{" "}
                  ({message.follower_count} followers)
                </p>
              ) : (
                <p className="text-baseText mt-2">
                  <span className="font-semibold">Creator:</span> deployed by
                  web-app
                </p>
              )}

              {/* Twitter */}
              <p className="text-baseText">
                <span className="font-semibold">Twitter:</span>{" "}
                {message.twitter_username ? (
                  <a
                    href={`https://twitter.com/${message.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-baseAccent hover:underline"
                  >
                    @{message.twitter_username}
                  </a>
                ) : (
                  "No Twitter"
                )}
              </p>

              {/* Timestamp */}
              <p className="text-sm text-gray-400 mt-2">
                Posted at: {new Date(message.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
