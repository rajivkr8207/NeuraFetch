import { motion } from "framer-motion";

const Button = ({
  children,
  type = "button",
  onClick,
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = "",
  variant = "primary", // primary | secondary | outline
}) => {
  const baseStyles =
    "relative w-full py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl overflow-hidden group flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700",
    secondary:
      "bg-gray-800 text-white hover:bg-gray-900",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 
                0 0 5.373 0 12h4zm2 5.291A7.962 
                7.962 0 014 12H0c0 3.042 1.135 
                5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading...
          </>
        ) : (
          <>
            {Icon && <Icon className="w-5 h-5" />}
            {children}
          </>
        )}
      </span>

      {/* Hover animation layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-700 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </motion.button>
  );
};

export default Button;