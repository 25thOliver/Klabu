import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="theme-toggle-button"
      style={{
        marginLeft: "auto",
        padding: "6px 12px",
        background: "#ddd",
        borderRadius: "4px",
        border: "none",
        cursor: "pointer"
      }}
    >
      {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
};

export default ThemeToggle;
