import axiosInstance from "../js/axiosInstance";
import { useEffect, useState, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const currentUser = localStorage.getItem("username");

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get("/chat/messages");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await axiosInstance.post("/chat/send", {
        senderUsername: currentUser,
        content: newMessage,
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

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
