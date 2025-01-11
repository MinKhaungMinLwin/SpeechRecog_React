// src/components/ChatBox.js

// import React, { useState } from 'react';
import React from 'react';

const ChatBox = ({ messages }) => {
  return (
    <div className="chat-box">
      {messages.map((msg, index) => (
        <div key={index} className={msg.from === 'user' ? 'user-msg' : 'bot-msg'}>
          <p>{msg.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatBox;
