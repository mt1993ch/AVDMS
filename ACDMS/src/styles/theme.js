import React, { createContext, useContext } from 'react';

// Create a context for the theme
const ThemeContext = createContext({
  darkMode: false,
  colors: {
    primary: '#4b5320',    // olive green
    primaryLight: '#5a6326',
    primaryDark: '#3b421a',
    secondary: '#c3b091',  // khaki
    secondaryLight: '#d4c4a8',
    secondaryDark: '#a89678',
    accent: '#e1c699',     // sand
    black: '#1a1a1a',
    darkGray: '#333333',
    mediumGray: '#666666',
    lightGray: '#cccccc',
    white: '#f5f5f5',
    error: '#8d2e21',
    success: '#3e5622',
    warning: '#b7803f',
    info: '#2d5d7c'
  }
});

// Theme provider component
export const ThemeProvider = ({ children, darkMode = false }) => {
  // Adjust colors based on dark mode
  const colors = {
    primary: darkMode ? '#3b421a' : '#4b5320',
    primaryLight: darkMode ? '#4b5320' : '#5a6326',
    primaryDark: darkMode ? '#2a3015' : '#3b421a',
    secondary: darkMode ? '#a89678' : '#c3b091',
    secondaryLight: darkMode ? '#c3b091' : '#d4c4a8',
    secondaryDark: darkMode ? '#8c7b64' : '#a89678',
    accent: darkMode ? '#b09872' : '#e1c699',
    black: '#1a1a1a',
    darkGray: '#333333',
    mediumGray: '#666666',
    lightGray: '#cccccc',
    white: '#f5f5f5',
    text: darkMode ? '#f5f5f5' : '#1a1a1a',
    background: darkMode ? '#1a1a1a' : '#f5f5f5',
    border: darkMode ? '#333333' : '#cccccc',
    error: '#8d2e21',
    success: '#3e5622',
    warning: '#b7803f',
    info: '#2d5d7c'
  };

  return (
    <ThemeContext.Provider value={{ darkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => useContext(ThemeContext);
