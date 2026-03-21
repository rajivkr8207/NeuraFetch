// src/components/Navbar.jsx

import {  useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useauth";

export default function Navbar() {
  const { user, handleLogout } = useAuth();
  const { handleGetMe } = useAuth()

  useEffect(() => {
    handleGetMe()
  }, [])

  const onLogout = async () => {
    await handleLogout();
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center">

      <Link to="/" className="text-xl font-bold text-black dark:text-white">
NeuraFetch
      </Link>

      <div className="flex items-center gap-4">

        <Link
          to="/"
          className="text-gray-700 dark:text-gray-200 px-2 py-1 rounded-lg transform duration-300 hover:bg-white/80 hover:text-black"
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

        {/* 🌙 Theme Toggle
        <button
          onClick={toggleTheme}
          className="ml-2 px-3 py-1 border rounded-lg dark:text-white"
        >
          {darkMode ? "☀️" : "🌙"}
        </button> */}
      </div>
    </nav>
  );
}