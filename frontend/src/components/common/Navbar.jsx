// src/components/Navbar.jsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useauth";

export default function Navbar() {
  const { user, handleLogout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Apply class to HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // 🔥 Logout Handler
  const onLogout = async () => {
    await handleLogout();
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-black dark:text-white">
        AI Extractor
      </Link>

      {/* Links */}
      <div className="flex items-center gap-4">

        <Link
          to="/"
          className="text-gray-700 dark:text-gray-200 hover:text-black"
        >
          Home
        </Link>

        {!user ? (
          <>
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-200"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="text-gray-700 dark:text-gray-200"
            >
              Profile
            </Link>

            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        )}

        {/* 🌙 Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="ml-2 px-3 py-1 border rounded-lg dark:text-white"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  );
}