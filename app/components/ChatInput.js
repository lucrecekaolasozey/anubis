"use client";

import { useState } from "react";

export default function ChatInput({ onSendMessage }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      console.log("Sending message:", input);
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mt-2 flex w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        className="flex-grow p-2 rounded-l bg-baseAccent text-white border border-gray-500 focus:outline-none"
        style={{ padding: "0.5rem" }} // Уменьшенные паддинги
      />
      <button
        onClick={handleSend}
        className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
}
