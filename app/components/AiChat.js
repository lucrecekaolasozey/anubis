"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import ChatHeader from "./ChatHeader";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import { toast } from "react-toastify";

export default function AIChat() {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const { userId, walletAddress, isAuthenticated, ready } = useAuth();

  // Проверка авторизации
  useEffect(() => {
    if (ready && isAuthenticated === false) {
      console.log("User not authenticated. Redirecting...");
      toast.warn("Authorization required. Redirecting to home...", {
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
    }
  }, [isAuthenticated, ready]);

  // Загрузка чатов
  useEffect(() => {
    const loadChats = async () => {
      if (!ready || !isAuthenticated || !walletAddress || !userId) return;

      try {
        const { data } = await axios.get("/api/chats", {
          headers: {
            "wallet-address": walletAddress,
            "user-id": userId,
          },
        });
        setChats(data);
        if (data.length > 0) {
          setCurrentChatId(data[0].id);
        }
      } catch (error) {
        console.error("Error loading chats:", error.response?.data || error.message);
      }
    };

    loadChats();
  }, [ready, isAuthenticated, walletAddress, userId]);

  // Отправка сообщения
  const sendMessage = async (text) => {
    if (!currentChatId || !walletAddress || !userId) return;

    const newMessages = [...messages, { text, isUser: true }];
    setMessages(newMessages);

    try {
      // Сохраняем сообщение в базе данных
      await axios.post("/api/chat_messages", {
        chatId: currentChatId,
        isUser: true,
        text,
      });

      // Отправляем сообщение в OpenAI для генерации ответа
      const aiResponse = await axios.post("/api/openai", { message: text });
      const reply = aiResponse.data.reply;

      if (reply) {
        const botMessage = { text: reply, isUser: false };
        setMessages((prev) => [...prev, botMessage]);

        // Сохраняем ответ бота в базе данных
        await axios.post("/api/chat_messages", {
          chatId: currentChatId,
          isUser: false,
          text: reply,
        });
      }
    } catch (error) {
      console.error("Error communicating with OpenAI:", error.response?.data || error.message);
    }
  };

  // Создание нового чата
  const createNewChat = async () => {
    const chatName = prompt("Enter chat name:");
    if (!chatName || !walletAddress || !userId) return;

    try {
      const { data } = await axios.post(
        "/api/chats",
        { userId, chatName },
        { headers: { "wallet-address": walletAddress } }
      );

      setChats([{ id: data.chatId, chat_name: chatName }, ...chats]);
      setCurrentChatId(data.chatId);
      setMessages([]);
    } catch (error) {
      console.error("Error creating new chat:", error.response?.data || error.message);
    }
  };

  // Удаление чата
  const deleteChat = async (chatId) => {
    if (!chatId || !walletAddress || !userId) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmDelete) return;

    try {
      await axios.delete("/api/chats", {
        headers: {
          "chat-id": chatId,
          "user-id": userId,
          "wallet-address": walletAddress,
        },
      });

      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
      if (chatId === currentChatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting chat:", error.response?.data || error.message);
    }
  };

  // Переключение чата
  const switchChat = async (chatId) => {
    setCurrentChatId(chatId);
    try {
      const { data } = await axios.get("/api/chat_messages", {
        headers: { "chat-id": chatId },
      });
      setMessages(data.map((msg) => ({ ...msg, isUser: msg.is_user })));
    } catch (error) {
      console.error("Error switching chat:", error.response?.data || error.message);
    }
  };

  return (
    <div className="chat-container">
      <ChatHeader
        chatId={currentChatId}
        chats={chats}
        onNewChat={createNewChat}
        onSelectChat={switchChat}
        onDeleteChat={deleteChat}
      />
      {chats.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>No chats available. Please create a new chat to start.</p>
        </div>
      ) : (
        <>
          <div className="chat-history">
            <ChatHistory messages={messages} />
          </div>
          <div className="chat-input-container">
            <ChatInput onSendMessage={sendMessage} />
          </div>
        </>
      )}
    </div>
  );
}
