import { useState } from "react";
import useAuth from "../hooks/useauth";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const {handleLogin, isError, isLoading} = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleLogin(formData)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back
        </h2>

        {isError && (
          <p className="text-center text-sm mb-4">{isError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register Redirect */}
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <span className="text-blue-500 cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
}