"use client";
import Link from "next/link";
import "./Navbar.css";

function Navbar({ theme, setTheme }) {
  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Theme toggle clicked:", { currentTheme: theme, newTheme });
    setTheme(newTheme);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-brand">
          <Link href="/" className="brand-link">
            <span className="brand-icon">✓</span>
            <span className="brand-text">Smart Todo</span>
          </Link>
        </div>

        <div className="nav-links">
          <Link href="/" className="nav-link">
            Dashboard
          </Link>
          <Link href="/add-task" className="nav-link add-task-link">
            <span className="add-icon">+</span>
            <h2>Add Task</h2>
          </Link>
        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
