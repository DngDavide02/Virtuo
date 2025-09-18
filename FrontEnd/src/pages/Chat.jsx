import { useEffect, useRef, useState } from "react";
import axiosInstance from "../js/axiosInstance";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [started, setStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser).username : "Player";

  const sessionId = "mock-session-1";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    if (!started) setStarted(true);

    const userMsg = {
      senderUsername: currentUser,
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");
    inputRef.current?.focus();
    setIsLoading(true);

    try {
      const res = await axiosInstance.post(`/ai-chat/send?sessionId=${sessionId}`, { message: trimmed });

      const aiMsg = {
        senderUsername: "User",
        content: res?.data?.response ?? "Sorry, I can't respond right now.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Error in chat:", err);
      const errorMsg = {
        senderUsername: "User",
        content: "Sorry, I can't respond right now.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim()) sendMessage();
    }
  };

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="chat-page">
      {!started && <div className="chat-intro">Type something to start the chat...</div>}

      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((msg, idx) => {
          const isOwn = msg.senderUsername === currentUser;
          return (
            <div key={idx} className={`chat-row ${isOwn ? "own-row" : "other-row"}`}>
              <div className={`avatar ${isOwn ? "avatar-own" : "avatar-other"}`} aria-hidden>
                {msg.senderUsername.charAt(0).toUpperCase()}
              </div>

              <div className={`chat-bubble ${isOwn ? "own" : "other"} fade-in`}>
                <div className="chat-username">{msg.senderUsername}</div>
                <div className="chat-text">{msg.content}</div>
                <div className="chat-meta">{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="chat-row other-row typing-row">
            <div className="avatar avatar-other" aria-hidden>
              U
            </div>
            <div className="chat-bubble other typing">
              <div className="chat-username">User</div>
              <div className="chat-text">
                <span className="dot" /> <span className="dot" /> <span className="dot" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-bar" onSubmit={sendMessage} aria-label="Chat input form">
        <textarea
          ref={inputRef}
          className="chat-input"
          rows={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          aria-label="Type a message"
        />
        <button type="submit" className="chat-send-btn" disabled={!newMessage.trim() && !isLoading} aria-label="Send message">
          <i className="bi bi-send-fill" aria-hidden></i>
        </button>
      </form>
    </div>
  );
}
