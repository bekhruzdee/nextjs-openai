"use client";
import { useEffect, useRef, useState } from "react";
import { ChatCompletionMessage } from "./chat-completion-message.interface";
import createChatCompletion from "./createChatCompletion";

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function Home() {
  const [messages, setMessages] = useState<
    (ChatCompletionMessage & { id: string })[]
  >([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      id: generateId(),
      role: "user" as const,
      content: message,
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setMessage("");
    setError(null);

    try {
      const completion = await createChatCompletion(updatedMessages);
      if (completion?.choices?.length) {
        const response = {
          id: generateId(),
          ...completion.choices[0].message,
        };
        setMessages([...updatedMessages, response]);
      } else {
        setError("No response from AI. Please try again.");
      }
    } catch (err) {
      setError(
        "Failed to fetch response from AI. Please check your connection or API key."
      );
      console.error("API call failed:", err);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        {}
        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg shadow-md">
            {error}
          </div>
        )}

        {}
        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs shadow-lg ${
                  message.role === "user"
                    ? "bg-blue-100 text-black"
                    : "bg-gray-300 text-black dark:bg-gray-700 dark:text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {}
          <div ref={messagesEndRef}></div>
        </div>

        {}
        <div className="flex items-center gap-2 justify-center">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === "Enter") await handleMessage();
            }}
            className="flex-grow rounded-full px-5 py-3 bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-md"
          />
          <button
            onClick={handleMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 transition duration-200 shadow-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
