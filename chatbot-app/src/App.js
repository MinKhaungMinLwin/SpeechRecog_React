import React, { useState } from 'react';
import axios from 'axios';
import ChatBox from './components/ChatBox';
import VoiceInputButton from './components/VoiceInputButton';
import { Container, Row, Col, Navbar, Button, Form, InputGroup } from 'react-bootstrap';
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
    <Container fluid className="app-container">
      {/* Navbar */}
      <Navbar bg="secondary-subtle" expand="lg" sticky="top" className="shadow-sm mb-3">
        <Container className="navbar-container mx-auto d-flex justify-content-center w-100">
          <Navbar.Brand className="text-info">Virtual Assistant</Navbar.Brand>
        </Container>
      </Navbar>

      {/* Chat and Input Container */}
      <Container className="main-container">
        {/* Chat Box */}
        <Row>
          <Col>
            <div className="chat-box">
              <ChatBox messages={messages} />
            </div>
          </Col>
        </Row>

        {/* Input and Buttons */}
        <Row className="mt-3">
          <Col>
            <Form>
              <InputGroup>
                <Form.Control
                  as="textarea"
                  rows={2}
                  className="form-control"
                  placeholder="Type your message"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleUserInput(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
              </InputGroup>
            </Form>
          </Col>
        </Row>

        {/* Button Row */}
        <Row className="mt-3 justify-content-between">
          <Col xs="auto" className="button-col">
            <Button
              variant="outline-success"
              className="custom-button"
              size="sm" // Adjust this to "lg" for larger buttons or "sm" for smaller ones
              onClick={() => {
                const textarea = document.querySelector('textarea');
                handleUserInput(textarea.value);
                textarea.value = '';
              }}
            >
              Send
            </Button>
          </Col>
          <Col xs="auto" className="button-col">
            <Button
              variant="outline-info"
              className="custom-button"
              size="sm" // Adjust this to "lg" or "sm"
              onClick={handleVoiceInput}
            >
              {isListening ? 'Listening...' : 'Speak'}
            </Button>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default App;
