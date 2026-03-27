// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiAlertCircle,
  FiCheckCircle,
  FiUserCheck,
} from "react-icons/fi";
import useAuth from "../hooks/useauth";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailValid, setEmailValid] = useState(null);

  const { handleRegister, isError, isLoading } = useAuth();

  // Password strength checker
  useEffect(() => {
    const password = formData.password;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    let score = 0;
    let feedback = "";

    if (passedChecks === 0) {
      score = 0;
      feedback = "Very weak";
    } else if (passedChecks <= 2) {
      score = 25;
      feedback = "Weak";
    } else if (passedChecks <= 3) {
      score = 50;
      feedback = "Fair";
    } else if (passedChecks <= 4) {
      score = 75;
      feedback = "Good";
    } else {
      score = 100;
      feedback = "Strong";
    }

    setPasswordStrength({ score, feedback, checks });
  }, [formData.password]);

  // Username availability check (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.username.length >= 3) {
        checkUsernameAvailability(formData.username);
      } else {
        setUsernameAvailable(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formData.username]);

  // Email validation
  useEffect(() => {
    if (formData.email) {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      setEmailValid(isValid ? null : false);
    } else {
      setEmailValid(null);
    }
  }, [formData.email]);

  const checkUsernameAvailability = async (username) => {
    // Mock API call - replace with actual API
    try {
      // const response = await fetch(`/api/check-username?username=${username}`);
      // const data = await response.json();
      // setUsernameAvailable(data.available);

      // Mock response for demo
      const takenUsernames = ["john", "admin", "user", "test"];
      setUsernameAvailable(!takenUsernames.includes(username.toLowerCase()));
    } catch (error) {
      console.error("Error checking username:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleRegister(formData);
  };

  // Animation variants
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

  // Password strength color
  const getStrengthColor = () => {
    if (passwordStrength.score <= 25) return "bg-red-500";
    if (passwordStrength.score <= 50) return "bg-orange-500";
    if (passwordStrength.score <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Decorative Header */}
          <div className="relative h-32 bg-gradient-to-r from-purple-600 to-pink-600">
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
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg mb-4"
              >
                <span className="text-3xl">✨</span>
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                Join the knowledge revolution
              </p>
            </div>

            {/* Error Message */}
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

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <motion.div variants={itemVariants} className="relative">
                <div className={`relative transition-all duration-200 ${focusedField === 'username' ? 'transform scale-[1.02]' : ''
                  }`}>
                  <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
                    required
                  />
                  {formData.username.length >= 3 && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {usernameAvailable === true && (
                        <FiCheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {usernameAvailable === false && (
                        <FiAlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                {usernameAvailable === false && (
                  <p className="text-xs text-red-500 mt-1 ml-4">
                    Username already taken
                  </p>
                )}
                {usernameAvailable === true && (
                  <p className="text-xs text-green-500 mt-1 ml-4">
                    Username available
                  </p>
                )}
              </motion.div>

              {/* Full Name Field */}
              <motion.div variants={itemVariants} className="relative">
                <div className={`relative transition-all duration-200 ${focusedField === 'fullName' ? 'transform scale-[1.02]' : ''
                  }`}>
                  <FiUserCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
                    required
                  />
                </div>
              </motion.div>

              {/* Email Field */}
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
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
                    required
                  />
                  {emailValid === false && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <FiAlertCircle className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                </div>
                {emailValid === false && (
                  <p className="text-xs text-red-500 mt-1 ml-4">
                    Please enter a valid email address
                  </p>
                )}
              </motion.div>

              {/* Password Field */}
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
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${passwordStrength.score}%` }}
                          className={`h-full ${getStrengthColor()} rounded-full transition-all duration-300`}
                        />
                      </div>
                      <span className={`text-xs ml-2 font-medium ${passwordStrength.score <= 25 ? "text-red-500" :
                          passwordStrength.score <= 50 ? "text-orange-500" :
                            passwordStrength.score <= 75 ? "text-yellow-500" :
                              "text-green-500"
                        }`}>
                        {passwordStrength.feedback}
                      </span>
                    </div>

                    {/* Password Requirements */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(passwordStrength.checks).map(([key, passed]) => (
                        <div key={key} className="flex items-center gap-1.5">
                          {passed ? (
                            <FiCheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <FiAlertCircle className="w-3 h-3 text-gray-400" />
                          )}
                          <span className={passed ? "text-green-600 dark:text-green-400" : "text-gray-500"}>
                            {key === "length" ? "Min 8 characters" :
                              key === "uppercase" ? "Uppercase letter" :
                                key === "lowercase" ? "Lowercase letter" :
                                  key === "number" ? "Number" :
                                    "Special character"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>


              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="w-5 h-5" />
                        Create Account
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </motion.button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or sign up with
                </span>
              </div>
            </motion.div>


            {/* Login Link */}
            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700 dark:hover:text-purple-300 transition-all hover:underline ml-1"
                >
                  Sign in
                </button>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6"
        >
          By creating an account, you agree to receive educational content and updates
        </motion.p>
      </motion.div>
    </div>
  );
}