// src/components/VoiceInputButton.js

import React from 'react';

const VoiceInputButton = ({ onSpeak }) => {
  const handleSpeak = () => {
    onSpeak(); // Trigger voice input functionality
  };

  return (
    <button
      className="btn btn-outline-primary"
      onClick={handleSpeak}
    >
      <i className="fas fa-microphone"></i> Speak
    </button>
  );
};

export default VoiceInputButton;
