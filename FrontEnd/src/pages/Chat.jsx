import axiosInstance from "../js/axiosInstance";
import { useEffect, useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get("/api/chat/messages");
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div>
      {messages.map((msg, idx) => (
        <div key={idx}>
          <strong>{msg.senderUsername}: </strong>
          {msg.content} <em>({msg.timestamp})</em>
        </div>
      ))}
    </div>
  );
}
