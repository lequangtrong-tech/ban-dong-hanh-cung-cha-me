
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Message } from './types';
import { Role } from './types';
import { SYSTEM_PROMPT } from './constants';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: Role.Model,
      parts: [{ text: "Chào bạn, tôi là 'Bạn Đồng Hành cùng Cha mẹ'. Tôi ở đây để lắng nghe và hỗ trợ bạn trên hành trình kết nối với con. Hãy chia sẻ bất cứ điều gì đang khiến bạn trăn trở nhé." }],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    const initChat = () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatInstance = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction: SYSTEM_PROMPT,
          },
        });
        chatRef.current = chatInstance;
      } catch (e: any) {
        console.error("Error initializing chat:", e);
        setError("Không thể khởi tạo chatbot. Vui lòng kiểm tra API key và làm mới trang.");
      }
    };
    initChat();
  }, []);

const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = { role: Role.User, parts: [{ text }] };
    setMessages(prev => [...prev, userMessage]);

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Server error");
        }

        const botReply: Message = {
            role: Role.Model,
            parts: [{ text: data.reply }]
        };

        setMessages(prev => [...prev, botReply]);

    } catch (e: any) {
        console.error(e);

        setMessages(prev => [
            ...prev,
            { role: Role.Model, parts: [{ text: "Rất tiếc, đã có lỗi xảy ra." }] }
        ]);

        setError("Rất tiếc, đã có lỗi xảy ra.");

    } finally {
        setIsLoading(false);
    }
}, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <Header />
      <ChatWindow messages={messages} isLoading={isLoading} />
      <div className="p-4 bg-white border-t border-gray-200">
        {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
        <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
      <Footer />
    </div>
  );
};

export default App;
