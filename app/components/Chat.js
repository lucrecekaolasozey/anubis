"use client";

import { useState, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-baseDark text-white">
      <div className="flex-grow overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-start mb-4 bg-gray-900 p-4 rounded shadow"
          >
            <img
              src={message.image_url || "/default-avatar.png"} // Аватар или изображение токена
              alt="Token Image"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="text-sm text-gray-400">
                {new Date(message.timestamp).toLocaleString()}
              </p>
              <p>
                <b>{message.token_name}</b> ({message.contract_address})
              </p>
              <p>Creator: {message.creator_username}</p>
              <p>Followers: {message.follower_count}</p>
              {message.twitter_username && (
                <p>Twitter: @{message.twitter_username}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
