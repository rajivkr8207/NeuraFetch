import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../features/auth/hooks/useauth";
import Button from "../ui/Button";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, handleLogout, handleGetMe } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    handleGetMe();
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const logout = async () => {
    await handleLogout();
    setOpen(false);
    navigate("/login");
  };

  const NavLinks = ({ mobile = false }) => (
    <>
      <Link 
        to="/" 
        onClick={() => setOpen(false)} 
        className={`${
          mobile 
            ? "block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            : "text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white px-3 py-2 rounded-lg transition-colors"
        }`}
      >
        Home
      </Link>

      {!user ? (
        <>
          <Link 
            to="/login" 
            onClick={() => setOpen(false)} 
            className={`${
              mobile 
                ? "block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                : "text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white px-3 py-2 rounded-lg transition-colors"
            }`}
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className={`${
              mobile 
                ? "block px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-center"
                : "bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            }`}
          >
            Register
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className={`${
              mobile 
                ? "block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                : "text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white px-3 py-2 rounded-lg transition-colors"
            }`}
          >
            Profile
          </Link>
          <Button 
            onClick={logout} 
            className={`${
              mobile 
                ? " px-4 py-1"
                : "  px-4 py-1 "
            }`}
          >
            Logout
          </Button>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 sm:px-6 h-16">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl sm:text-2xl font-bold text-black dark:text-white hover:opacity-80 transition-opacity"
        >
          NeuraFetch
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavLinks />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm bg-opacity-50 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
          
          {/* Mobile Menu Panel */}
          <div className="fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-40 md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4 space-y-2">
              <NavLinks mobile />
              
              {/* Optional: User Info */}
              {user && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="px-4 text-sm text-gray-600 dark:text-gray-400">
                    Signed in as
                  </p>
                  <p className="px-4 text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.email || user.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}