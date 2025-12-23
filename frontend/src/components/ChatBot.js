"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Bot, Send, X, MessageCircle } from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "안녕하세요! DJ 뮤직봇입니다. 🎵\n어떤 노래를 추천해 드릴까요?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post("/api/chatbot/chat", {
        message: userMsg,
      });

      setMessages((prev) => [...prev, { role: "ai", text: res.data.response }]);
    } catch (error) {
      console.error("챗봇 에러:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "오류가 발생했습니다. 잠시 후 다시 시도해주세요. 😭",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-28 right-6 z-50 bg-green-500 text-black p-4 rounded-full shadow-lg hover:bg-green-400 hover:scale-110 transition duration-300"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-44 right-6 z-50 w-80 md:w-96 h-[500px] bg-[#181818] border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* 🚨 [수정됨] bg-gradient-to-r -> bg-linear-to-r */}
          <div className="bg-linear-to-r from-green-600 to-green-400 p-4 flex items-center gap-2">
            <div className="bg-white p-1 rounded-full">
              <Bot size={20} className="text-green-600" />
            </div>
            <h3 className="font-bold text-black">AI DJ 뮤직봇</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-green-500 text-black rounded-tr-none"
                      : "bg-[#2a2a2a] text-white rounded-tl-none border border-gray-700"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2a2a] p-3 rounded-2xl rounded-tl-none border border-gray-700 text-gray-400 text-sm">
                  AI가 선곡 중입니다... 💿
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="p-3 bg-[#121212] border-t border-gray-800 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="우울할 때 들을 노래 추천해줘..."
              className="flex-1 bg-[#2a2a2a] text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-black p-2 rounded-full hover:bg-green-400 disabled:opacity-50 transition"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
