import React, { useState, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./GeminiChat.css";
import Navbar from "../template/Navbar";

const GeminiChat = () => {
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState([]);
  const [editorContent, setEditorContent] = useState("");
  const chatRef = useRef();

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = { type: "user", text: prompt };
    setChat((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:5000/gemini/askSomething", {
        prompt: prompt,
      });

      const botMessage = {
        type: "bot",
        text: response.data || "No response received.",
      };

      setChat((prev) => [...prev, botMessage]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { type: "bot", text: "Error contacting the server." },
      ]);
      console.error("Error:", err);
    }

    setPrompt("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const populateEditor = () => {
    const formattedChat = chat
      .map((msg) => {
        const sender = msg.type === "user" ? "<strong>You:</strong>" : "<strong>Bot:</strong>";
        return `<p>${sender} ${msg.text}</p>`;
      })
      .join("");
    setEditorContent(formattedChat);
  };

  const downloadPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = editorContent;

    const opt = {
      margin: 0.5,
      filename: "chat_transcript.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <>
      <Navbar />
      <div className="gemini-chat-container mt-[100px]">
        <div className="chat-box" ref={chatRef}>
          {chat.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.type}`}>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask me anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend}>Send</button>
          <button
            onClick={populateEditor}
            style={{ marginLeft: "10px", backgroundColor: "#1976d2", color: "white" }}
          >
            Edit Chat
          </button>
        </div>

        {editorContent && (
          <div className="editor-container mt-5" style={{ marginTop: "20px" }}>
            <ReactQuill
              value={editorContent}
              onChange={setEditorContent}
              theme="snow"
              style={{ backgroundColor: "#fff", minHeight: "200px" }}
            />
            <button
              onClick={downloadPDF}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                backgroundColor: "#43a047",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Download Edited PDF
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GeminiChat;
