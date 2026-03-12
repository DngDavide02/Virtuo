import React, { memo } from 'react';

const TypingIndicator = memo(() => {
  return (
    <div className="chat-row other-row typing-row">
      <div className="avatar avatar-other" aria-hidden>
        G
      </div>
      <div className="chat-bubble other typing">
        <div className="chat-username">Gaming Assistant</div>
        <div className="chat-text">
          <span className="dot" /> <span className="dot" /> <span className="dot" />
        </div>
      </div>
    </div>
  );
});

TypingIndicator.displayName = 'TypingIndicator';

export default TypingIndicator;
