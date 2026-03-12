import React from "react";
import { useSimulatedChat } from "../hooks/useSimulatedChat";
import { ChatWindow, ChatInput } from "../components/Chat";
import "../css/chat.css";

export default function Chat() {
  const { messages, newMessage, isTyping, started, currentUser, messagesEndRef, inputRef, formatTime, sendMessage, handleInputChange, handleKeyDown } =
    useSimulatedChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(newMessage);
  };

  return (
    <div className="chat-page">
      <ChatWindow messages={messages} isTyping={isTyping} currentUser={currentUser} formatTime={formatTime} messagesEndRef={messagesEndRef} started={started} />

      <ChatInput
        newMessage={newMessage}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
        inputRef={inputRef}
        disabled={isTyping}
      />
    </div>
  );
}
