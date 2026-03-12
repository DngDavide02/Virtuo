import React, { memo } from 'react';

const ChatMessage = memo(({ message, isOwn, formatTime }) => {
  return (
    <div className={`chat-row ${isOwn ? 'own-row' : 'other-row'}`}>
      {/* Avatar */}
      <div className={`avatar ${isOwn ? 'avatar-own' : 'avatar-other'}`} aria-hidden>
        {message.senderUsername.charAt(0).toUpperCase()}
      </div>

      {/* Message bubble */}
      <div className={`chat-bubble ${isOwn ? 'own' : 'other'} fade-in`}>
        <div className="chat-username">{message.senderUsername}</div>
        <div className="chat-text">{message.content}</div>
        <div className="chat-meta">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;
