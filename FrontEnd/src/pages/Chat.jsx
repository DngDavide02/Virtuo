import { useState } from "react";
import axiosInstance from "../js/axiosInstance";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [started, setStarted] = useState(false);
  const currentUser = localStorage.getItem("username") || "Player";

  const sessionId = "mock-session-1";

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (!started) setStarted(true);

    const userMsg = {
      senderUsername: currentUser,
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setNewMessage("");

    try {
      const res = await axiosInstance.post(`/ai-chat/send?sessionId=${sessionId}`, {
        message: newMessage,
      });

      const aiMsg = {
        senderUsername: "User",
        content: res.data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg, aiMsg]);
    } catch (err) {
      console.error("Error in chat:", err);
      const errorMsg = {
        senderUsername: "User",
        content: "Sorry, I can't respond right now.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg, errorMsg]);
    }
  };

  return (
    <div className="chat-page">
      {!started && <div className="chat-intro">Type something to start the chat...</div>}

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.senderUsername === currentUser ? "own" : "other"}`}>
            <div className="chat-username">{msg.senderUsername}</div>
            <div className="chat-text">{msg.content}</div>
            <div className="chat-meta">{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      <form className="chat-input-bar" onSubmit={sendMessage}>
        <input className="chat-input" type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
        <button type="submit" className="chat-send-btn">
          <i className="bi bi-send"></i>
        </button>
      </form>
    </div>
  );
}
