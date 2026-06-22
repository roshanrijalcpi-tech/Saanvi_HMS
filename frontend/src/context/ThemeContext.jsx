import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.classList.add('bg-dark', 'text-light');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      document.body.classList.remove('bg-dark', 'text-light');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);