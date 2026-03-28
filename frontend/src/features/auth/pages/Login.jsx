import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLogIn,
  FiAlertCircle,
} from "react-icons/fi";
import useAuth from "../hooks/useauth";
import Button from "../../../components/ui/Button";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [passwordlength, setPasswordLength] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const { handleLogin, isError, isLoading } = useAuth();
  const user = useSelector((state) => state.auth.user)
  const loading = useSelector((state) => state.auth.loading)

  useEffect(() => {
    if (formData.password.length >= 8) {
      setPasswordLength(true)
    } else {
      setPasswordLength(false)
    }
  }, [formData.password])

  if (!loading && user) {
    return <Navigate to={'/'} replace />
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleLogin(formData);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative Header */}
          <div className="relative h-32 bg-gradient-to-r from-orange-600 to-red-600">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 rounded-t-3xl transform translate-y-1/2"></div>
          </div>

          {/* Content */}
          <div className="px-8 pb-8 pt-12">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl shadow-lg mb-4"
              >
                <span className="text-3xl">📚</span>
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                Sign in to continue to your knowledge base
              </p>
            </div>

            <AnimatePresence>
              {isError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3"
                >
                  <FiAlertCircle className="text-red-500 w-5 h-5 flex-shrink-0" />
                  <p className="text-red-600 dark:text-red-400 text-sm flex-1">{isError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={itemVariants} className="relative">
                <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'transform scale-[1.02]' : ''
                  }`}>
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'transform scale-[1.02]' : ''
                  }`}>
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition"
                >
                  Forgot password?
                </button>
              </motion.div>

              <Button
                type="submit"
                isLoading={isLoading}
                disabled={!passwordlength}
                icon={FiLogIn}
              >
                Sign In
              </Button>
            </form>

            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300 transition-all hover:underline ml-1"
                >
                  Create an account
                </Link>
              </p>
            </motion.div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}