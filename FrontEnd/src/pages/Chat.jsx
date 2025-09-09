import { useEffect, useState, useRef } from "react";
import axiosInstance from "../js/axiosInstance";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const currentUser = localStorage.getItem("username") || "Player";

  const sessionId = "mock-session-1";

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMsg = {
      senderUsername: currentUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");

    try {
      const res = await axiosInstance.post(`/ai-chat/send?sessionId=${sessionId}`, {
        message: newMessage,
      });

      const aiMsg = {
        senderUsername: "AI",
        content: res.data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Errore nella chat AI:", err);
      const errorMsg = {
        senderUsername: "AI",
        content: "Mi dispiace, non riesco a rispondere al momento.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-page">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.senderUsername === currentUser ? "own" : "other"}`}>
            <div className="chat-text">{msg.content}</div>
            <div className="chat-meta">{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-bar sticky" onSubmit={sendMessage}>
        <input className="chat-input" type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Scrivi un messaggio..." />
        <button type="submit" className="chat-send-btn">
          →
        </button>
      </form>
    </div>
  );
}
