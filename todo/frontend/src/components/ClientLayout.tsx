"use client";
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { TaskProvider } from "../context/TaskContext";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [theme, setTheme] = useState("light");

  // Apply theme to document and persist preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    console.log("Loading saved theme:", savedTheme);
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    console.log("Applying theme:", theme);
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      console.log("Added dark class to document");
    } else {
      document.documentElement.classList.remove("dark");
      console.log("Removed dark class from document");
    }
    // Save theme preference
    localStorage.setItem("theme", theme);
    console.log("Saved theme to localStorage:", theme);
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    console.log("Theme change requested:", { current: theme, new: newTheme });
    setTheme(newTheme);
  };

  return (
    <TaskProvider>
      <Navbar theme={theme} setTheme={handleThemeChange} />
      {children}
    </TaskProvider>
  );
} 