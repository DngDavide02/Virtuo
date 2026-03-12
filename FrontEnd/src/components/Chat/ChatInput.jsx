import React, { memo } from 'react';

const ChatInput = memo(({ 
  newMessage, 
  onInputChange, 
  onKeyDown, 
  onSubmit, 
  inputRef, 
  disabled = false 
}) => {
  return (
    <form className="chat-input-bar" onSubmit={onSubmit} aria-label="Chat input form">
      <textarea
        ref={inputRef}
        className="chat-input"
        rows={1}
        value={newMessage}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder="Type a message..."
        aria-label="Type a message"
        disabled={disabled}
      />
      <button 
        type="submit" 
        className="chat-send-btn" 
        disabled={!newMessage.trim() || disabled} 
        aria-label="Send message"
      >
        <i className="bi bi-send-fill" aria-hidden></i>
      </button>
    </form>
  );
});

ChatInput.displayName = 'ChatInput';

export default ChatInput;
