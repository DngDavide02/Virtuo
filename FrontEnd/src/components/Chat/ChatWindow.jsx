import React, { memo } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

const ChatWindow = memo(({ 
  messages, 
  isTyping, 
  currentUser, 
  formatTime, 
  messagesEndRef, 
  started 
}) => {
  return (
    <>
      {/* Intro message if chat hasn't started */}
      {!started && (
        <div className="chat-intro">
          Type something to start the chat...
        </div>
      )}

      {/* Messages container */}
      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwn={message.senderUsername === currentUser}
            formatTime={formatTime}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </>
  );
});

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
