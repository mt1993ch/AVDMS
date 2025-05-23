import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import AddAgniveer from './components/AddAgniveer';
import SearchDatabase from './components/SearchDatabase';
import DataManagement from './components/DataManagement';
import Chatbot from './components/Chatbot';
import Header from './components/Header';
import { ThemeProvider } from './styles/theme';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Check if user is already authenticated (for demonstration - in real app would check local storage or session)
  useEffect(() => {
    const checkAuth = localStorage.getItem('isAuthenticated');
    if (checkAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setCurrentPage('home');
  };

  // Toggle chatbot visibility
  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  // Navigate to different pages
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Render the appropriate component based on current page
  const renderContent = () => {
    if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} />;
      case 'add':
        return <AddAgniveer navigateTo={navigateTo} />;
      case 'search':
        return <SearchDatabase navigateTo={navigateTo} />;
      case 'manage':
        return <DataManagement navigateTo={navigateTo} />;
      default:
        return <Home navigateTo={navigateTo} />;
    }
  };

  return (
    <ThemeProvider darkMode={darkMode}>
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        {isAuthenticated && (
          <Header 
            currentPage={currentPage} 
            navigateTo={navigateTo} 
            onLogout={handleLogout}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
        
        <main className="main-content">
          {renderContent()}
        </main>
        
        {isAuthenticated && (
          <Chatbot 
            isOpen={chatbotOpen} 
            toggleChatbot={toggleChatbot} 
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
