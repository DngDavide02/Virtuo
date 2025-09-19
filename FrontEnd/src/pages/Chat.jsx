import { useEffect, useRef, useState } from "react";
import axiosInstance from "../js/axiosInstance";

export default function Chat() {
  // Stato dei messaggi della chat
  const [messages, setMessages] = useState([]);
  // Stato del messaggio corrente digitato dall'utente
  const [newMessage, setNewMessage] = useState("");
  // Indica se la chat è stata avviata dall'utente
  const [started, setStarted] = useState(false);
  // Stato di caricamento durante la ricezione della risposta AI
  const [isLoading, setIsLoading] = useState(false);

  // Ref per il campo di input della chat
  const inputRef = useRef(null);
  // Ref per mantenere lo scroll sempre in fondo
  const messagesEndRef = useRef(null);

  // Recupera username dell'utente corrente dal localStorage
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser).username : "Player";

  // ID sessione mock
  const sessionId = "mock-session-1";

  /* Effettua scroll automatico verso il fondo della chat ad ogni aggiornamento dei messaggi o dello stato di loading */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  /* Focus automatico sull'input all'apertura del componente */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* Funzione per inviare un messaggio e ricevere risposta AI */
  const sendMessage = async (e) => {
    e?.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    if (!started) setStarted(true);

    // Costruzione del messaggio utente
    const userMsg = {
      senderUsername: currentUser,
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    // Aggiorna stato messaggi con il nuovo messaggio utente
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");
    inputRef.current?.focus();
    setIsLoading(true);

    try {
      // Invio del messaggio al backend AI
      const res = await axiosInstance.post(`/ai-chat/send?sessionId=${sessionId}`, { message: trimmed });

      // Costruzione della risposta AI
      const aiMsg = {
        senderUsername: "User",
        content: res?.data?.response ?? "Sorry, I can't respond right now.",
        timestamp: new Date().toISOString(),
      };

      // Aggiorna stato messaggi con la risposta AI
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

  /* Gestione invio messaggio con tasto Enter (senza Shift) */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim()) sendMessage();
    }
  };

  /* Formatta timestamp ISO in ora locale leggibile */
  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="chat-page">
      {/* Messaggio introduttivo se la chat non è stata avviata */}
      {!started && <div className="chat-intro">Type something to start the chat...</div>}

      {/* Lista dei messaggi */}
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((msg, idx) => {
          const isOwn = msg.senderUsername === currentUser;
          return (
            <div key={idx} className={`chat-row ${isOwn ? "own-row" : "other-row"}`}>
              {/* Avatar utente */}
              <div className={`avatar ${isOwn ? "avatar-own" : "avatar-other"}`} aria-hidden>
                {msg.senderUsername.charAt(0).toUpperCase()}
              </div>

              {/* Bolla del messaggio */}
              <div className={`chat-bubble ${isOwn ? "own" : "other"} fade-in`}>
                <div className="chat-username">{msg.senderUsername}</div>
                <div className="chat-text">{msg.content}</div>
                <div className="chat-meta">{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          );
        })}

        {/* Messaggio di caricamento AI */}
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

        {/* Ref per scroll automatico */}
        <div ref={messagesEndRef} />
      </div>

      {/* Barra di input per scrivere messaggi */}
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
