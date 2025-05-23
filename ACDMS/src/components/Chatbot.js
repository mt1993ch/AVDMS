import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../styles/theme';
import { generateChatbotResponse } from '../utils/chatbotUtils';

function Chatbot({ isOpen, toggleChatbot }) {
  const { colors } = useTheme();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm your ACDMS assistant. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  // Handle sending a message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message to chat
    const userMessageId = Date.now();
    const userMessage = { id: userMessageId, text: inputMessage, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    try {
      // Generate response using the offline chatbot utility
      const response = await generateChatbotResponse(inputMessage);
      
      // Add bot response to chat
      const botMessage = { id: Date.now(), text: response, sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (err) {
      console.error('Chatbot error:', err);
      // Add error message
      const errorMessage = {
        id: Date.now(),
        text: "I'm sorry, I couldn't process your request. Please try again.",
        sender: 'bot'
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Allow sending message with Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  if (!isOpen) {
    return (
      <div 
        className="chatbot-toggle"
        onClick={toggleChatbot}
        title="Open Chatbot Assistant"
      >
        <i data-feather="message-circle"></i>
      </div>
    );
  }
  
  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h5 className="m-0">ACDMS Assistant</h5>
        <button 
          className="btn-close btn-close-white"
          onClick={toggleChatbot}
          aria-label="Close"
        ></button>
      </div>
      
      <div className="chatbot-messages">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`message ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
            style={{
              alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.sender === 'user' ? colors.primary : colors.secondary,
              color: message.sender === 'user' ? '#fff' : '#000',
              padding: '8px 12px',
              borderRadius: '12px',
              maxWidth: '80%',
              marginBottom: '10px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            {message.text}
          </div>
        ))}
        
        {isTyping && (
          <div 
            className="message message-bot typing"
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.secondary,
              color: '#000',
              padding: '8px 12px',
              borderRadius: '12px',
              maxWidth: '80%',
              marginBottom: '10px'
            }}
          >
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef}></div>
      </div>
      
      <div className="chatbot-input">
        <form onSubmit={handleSendMessage} className="d-flex w-100">
          <input
            type="text"
            className="form-control"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="btn btn-primary ms-2"
            disabled={!inputMessage.trim() || isTyping}
          >
            <i data-feather="send"></i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chatbot;
