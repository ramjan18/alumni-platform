import React, { useState } from "react";
import { Send, Bot } from "lucide-react";

const Chatbox = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (input.trim() !== "") {
      const newMessages = [...messages, { text: input, sender: "user" }];
      setMessages(newMessages);
      setInput("");

      // Simulating AI Response (Replace this with API call)
      setTimeout(() => {
        setMessages([
          ...newMessages,
          { text: "I'm still learning! Stay tuned for updates.", sender: "bot" },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-[400px] border-2 border-[#BC0F0F] rounded-xl bg-white shadow-lg">
      {/* Chat Header */}
      <div className="bg-[#BC0F0F] text-white text-center font-semibold p-3 rounded-t-xl flex items-center gap-2">
        <Bot size={20} /> AI Chatbot
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[75%] ${
              msg.sender === "user"
                ? "bg-[#BC0F0F] text-white self-end ml-auto"
                : "bg-black text-white self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="flex items-center p-3 border-t border-gray-300">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BC0F0F]"
          placeholder="Ask me something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="ml-3 bg-[#BC0F0F] text-white p-2 rounded-md hover:bg-red-700 transition-all"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chatbox;
