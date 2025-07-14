import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const themeConfig = {
    light: {
      primary: "blue",
      secondary: "gray",
      background: "bg-gray-50",
      surface: "bg-white",
      text: "text-gray-900",
      textSecondary: "text-gray-600",
      border: "border-gray-200",
      shadow: "shadow-md"
    },
    dark: {
      primary: "blue",
      secondary: "gray",
      background: "bg-gray-900",
      surface: "bg-gray-800",
      text: "text-gray-100",
      textSecondary: "text-gray-400",
      border: "border-gray-700",
      shadow: "shadow-lg"
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      toggleTheme,
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar,
      themeConfig: themeConfig[theme],
      isDark: theme === "dark"
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}; 