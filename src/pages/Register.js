import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // Changed 'name' to 'username' for clarity
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState(""); // State for error messages
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  // Animation variants for form load
  const formVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Animation variants for button hover
  const buttonHoverVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 0 15px rgba(91, 42, 237, 0.6)", // Neon glow effect
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages

    // Input validation
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password strength (basic check: at least 6 characters)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Check if user already exists in localStorage (dummy check)
    const existingUser = localStorage.getItem(`whatif_user_${username}`);
    if (existingUser) {
      setError("Username already exists. Please choose a different username.");
      return;
    }

    try {
      // Save user info to LocalStorage
      const userData = { username, email, password }; // In a real app, hash the password!
      localStorage.setItem(`whatif_user_${username}`, JSON.stringify(userData));

      setSuccessMessage("Registration successful! Redirecting to login...");
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate("/login");
      }, 2000); // 2-second delay
    } catch (err) {
      setError("Failed to register. Please try again.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#151122] font-inter p-4">
      <motion.div
        className="bg-[#2c2348] p-8 rounded-xl shadow-lg w-full max-w-md border border-[#3f3267] relative overflow-hidden"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Background gradient for cyberpunk vibe */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#5b2aed] to-[#1a132e] opacity-20 blur-xl"></div>
        <div className="relative z-10"> {/* Ensure content is above the blurred background */}
          <h2 className="text-white text-3xl font-bold mb-6 text-center tracking-wide">Register for TimeScape</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-800 text-white p-3 rounded-lg text-center text-sm"
              >
                {error}
              </motion.p>
            )}
            {successMessage && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-800 text-white p-3 rounded-lg text-center text-sm"
              >
                {successMessage}
              </motion.p>
            )}

            {/* Username Input with Floating Label */}
            <div className="relative group">
              <input
                type="text"
                id="username"
                className="form-input w-full px-4 py-3 border border-[#3f3267] rounded-xl bg-[#1a132e] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#5b2aed] peer transition-all duration-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder=" " // Important for floating label
              />
              <label
                htmlFor="username"
                className="absolute left-4 -top-2 text-xs text-[#a092c9] bg-[#1a132e] px-1 transition-all duration-200
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#a092c9] peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0
                  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#5b2aed] peer-focus:bg-[#1a132e] peer-focus:px-1"
              >
                Username
              </label>
            </div>

            {/* Email Input with Floating Label */}
            <div className="relative group">
              <input
                type="email"
                id="email"
                className="form-input w-full px-4 py-3 border border-[#3f3267] rounded-xl bg-[#1a132e] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#5b2aed] peer transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder=" "
              />
              <label
                htmlFor="email"
                className="absolute left-4 -top-2 text-xs text-[#a092c9] bg-[#1a132e] px-1 transition-all duration-200
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#a092c9] peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0
                  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#5b2aed] peer-focus:bg-[#1a132e] peer-focus:px-1"
              >
                Email
              </label>
            </div>

            {/* Password Input with Floating Label and Toggle */}
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-input w-full px-4 py-3 pr-12 border border-[#3f3267] rounded-xl bg-[#1a132e] text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#5b2aed] peer transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder=" "
              />
              <label
                htmlFor="password"
                className="absolute left-4 -top-2 text-xs text-[#a092c9] bg-[#1a132e] px-1 transition-all duration-200
                  peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#a092c9] peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0
                  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#5b2aed] peer-focus:bg-[#1a132e] peer-focus:px-1"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a092c9] hover:text-[#5b2aed] focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {/* Eye icon (Lucide icon equivalent) */}
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucude-eye-off"><path d="M9.88 8.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>

            {/* Register Button */}
            <motion.button
              type="submit"
              className="w-full bg-[#5b2aed] text-white py-3 rounded-xl font-bold text-lg tracking-wide transition-colors duration-200 shadow-md"
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Register
            </motion.button>
          </form>

          <p className="mt-6 text-sm text-center text-[#a092c9]">
            Already have an account?{" "}
            <Link to="/login" className="text-[#5b2aed] hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
