
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
    if (!text.trim() || !chatRef.current) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = { role: Role.User, parts: [{ text }] };
    setMessages(prev => [...prev, userMessage]);

    // Add a placeholder for the model's response
    setMessages(prev => [...prev, { role: Role.Model, parts: [{ text: "" }] }]);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: text });

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text;
        if (chunkText) {
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === Role.Model) {
              const updatedParts = [{ text: (lastMessage.parts[0].text || "") + chunkText }];
              return [...prev.slice(0, -1), { ...lastMessage, parts: updatedParts }];
            }
            return prev;
          });
        }
      }
    } catch (e: any) {
      console.error("Error sending message:", e);
      const errorMessage = "Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.";
      setError(errorMessage);
       setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage.role === Role.Model && lastMessage.parts[0].text === "") {
               const updatedParts = [{ text: errorMessage }];
               return [...prev.slice(0, -1), { ...lastMessage, parts: updatedParts }];
            }
            return [...prev, {role: Role.Model, parts: [{text: errorMessage}]}];
        });
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
