import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChatHeader({ chatId, chats, onNewChat, onSelectChat, onDeleteChat }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleDeleteChat = async (chat) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the chat "${chat.chat_name}"? This action cannot be undone.`
    );
    if (confirmDelete) {
      await onDeleteChat(chat.id);
      toast.success(`Chat "${chat.chat_name}" deleted successfully.`);
    }
  };

  return (
    <div className="relative bg-baseGray p-4 rounded-t-lg flex items-center justify-between">
      <h2 className="text-lg font-bold text-white"></h2>
      <span className="text-sm text-gray-400 ml-2">Chat ID: {chatId}</span>
      <button
        onClick={togglePanel}
        className="ml-auto bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Options
      </button>

      {/* Выдвижная панель */}
      {isPanelOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-baseDark shadow-lg rounded-lg p-4 z-10">
          <h3 className="text-base font-bold text-white mb-4">Your Chats</h3>
          <button
            onClick={onNewChat}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-4"
          >
            + New Chat
          </button>
          <div className="flex flex-col gap-2">
            {chats.map((chat) => (
              <div key={chat.id} className="flex justify-between items-center">
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full p-2 rounded text-left ${
                    chat.id === chatId
                      ? "bg-blue-600 text-white"
                      : "bg-baseGray text-gray-300 hover:bg-baseAccent hover:text-white"
                  }`}
                >
                  {chat.chat_name || `Chat ${chat.id}`}
                </button>
                <button
                  onClick={() => handleDeleteChat(chat)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
