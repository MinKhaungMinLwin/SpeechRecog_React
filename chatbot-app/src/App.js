import React, { useState } from 'react';
import axios from 'axios';
import ChatBox from './components/ChatBox';
import VoiceInputButton from './components/VoiceInputButton';

import './style.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);

  // Handle text input from user
  const handleUserInput = async (message) => {
    if (!message.trim()) return;

    // Display user message in the chat
    setMessages((prev) => [...prev, { from: 'user', text: message }]);

    try {
      // Send the message to the backend API
      const response = await axios.post('http://127.0.0.1:4444/postdata', { text: message });

      const botResponse = response.data.speak || 'Sorry, no response received.';
      const audioUrl = response.data.audio_url;

      setMessages((prev) => [...prev, { from: 'bot', text: botResponse }]);

      // Play audio if audio URL is provided
      if (audioUrl) {
        const audio = new Audio(`http://127.0.0.1:4444${audioUrl}`);
        audio.onerror = () => console.error('Failed to load or play audio:');
        audio.play().catch((err) => console.error('Error playing audio:', err));
      }
    } catch (error) {
      console.error('Error while fetching response:', error);
      setMessages((prev) => [
        ...prev,
        { from: 'bot', text: 'Error: Unable to communicate with the server.' },
      ]);
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    setIsListening(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in your browser.');
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      const voiceMessage = event.results[0][0].transcript;
      setIsListening(false);
      handleUserInput(voiceMessage);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
  };

  return (
    <div className="app-container">
      <header className="navbar navbar-expand-lg bg-secondary-subtle sticky-top">
        <div className="container-fluid">
          <button className="navbar-brand text-info">Virtual Assistant</button>
        </div>
      </header>

      <div className="chat-container">
        <ChatBox messages={messages} />
        <div className="input-container">
          <textarea
            className="form-control"
            rows="2"
            placeholder="Type your message"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleUserInput(e.target.value);
                e.target.value = '';
              }
            }}
          ></textarea>
          <div className="button-container">
            <button
              className="btn btn-outline-success"
              onClick={() => {
                const textarea = document.querySelector('textarea');
                handleUserInput(textarea.value);
                textarea.value = '';
              }}
            >
              Send
            </button>
            <VoiceInputButton onSpeak={handleVoiceInput} isListening={isListening} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;