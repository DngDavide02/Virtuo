import axiosInstance from "../js/axiosInstance";
import { useEffect, useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get("/chat/messages"); // ✅ corretto
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
        senderUsername: localStorage.getItem("username"), // prende username salvato
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

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Chat</h2>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid #444",
          padding: "10px",
          marginBottom: "15px",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "10px" }}>
            <strong>{msg.senderUsername}: </strong>
            {msg.content} <em style={{ fontSize: "0.8em" }}>({msg.timestamp})</em>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Scrivi un messaggio..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #444",
            background: "#222",
            color: "white",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 15px",
            borderRadius: "5px",
            border: "none",
            background: "#0d6efd",
            color: "white",
            cursor: "pointer",
          }}
        >
          Invia
        </button>
      </form>
    </div>
  );
}
