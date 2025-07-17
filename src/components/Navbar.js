import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout, getUsername } from "../utils/auth.js"; // Ensure .js extension is correct for your setup

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to manage mobile menu visibility

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false); // Close menu on logout
  };

  // If not logged in, the Navbar should not be rendered
  if (!isLoggedIn()) {
    return null;
  }

  return (
    // The main nav container now uses the styling from the provided HTML header
    <nav className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2c2348] px-4 md:px-10 py-3 bg-[#151122] font-inter">
      <div className="container mx-auto flex justify-between items-center w-full">
        {/* Logo and Brand Name (from provided HTML) */}
        <div className="flex items-center gap-4 text-white">
          <div className="size-4">
            <svg viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path></svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">TimeScape</h2>
        </div>

        {/* Desktop Menu (from provided HTML, adapted for React Router Link) */}
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <div className="flex items-center gap-9">
            <Link to="/home" className="text-white text-sm font-medium leading-normal hover:text-gray-300">Home</Link>
            <Link to="/simulator" className="text-white text-sm font-medium leading-normal hover:text-gray-300">WhatIf Simulator</Link>
            <Link to="/newstimecapsule" className="text-white text-sm font-medium leading-normal hover:text-gray-300">News Time Capsule</Link>
            <Link to="/feedback" className="text-white text-sm font-medium leading-normal hover:text-gray-300">Feedback</Link> {/* Added Feedback Link */}
          </div>
          
          {/* User info and buttons */}
          <div className="flex items-center gap-4"> {/* Adjusted gap for consistency */}
            {/* Removed Question Mark Button */}
            
            {/* User Profile Picture - now a white circle with a user icon */}
            <div
              className="size-10 rounded-full bg-white flex items-center justify-center cursor-pointer"
              aria-label={`Profile of ${getUsername()}`} // Added aria-label for accessibility
            >
              {/* Generic user icon (Lucide icon equivalent) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user text-gray-800">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>

            {/* Logout Button (existing functionality) */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu Button (Hamburger Icon) */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              // Close icon (X)
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              // Hamburger icon
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content (Conditionally rendered) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#2c2348] bg-opacity-95 py-4 mt-3 rounded-lg shadow-xl transition-all duration-300 ease-in-out transform origin-top">
          <div className="flex flex-col items-center space-y-4">
            <Link 
              to="/home" 
              className="block text-white text-xl font-semibold hover:text-gray-300 transition-colors duration-300 w-full text-center py-2"
              onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
            >
              Home
            </Link>
            <Link 
              to="/simulator" 
              className="block text-white text-xl font-semibold hover:text-gray-300 transition-colors duration-300 w-full text-center py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              WhatIf Simulator
            </Link>
            <Link 
              to="/newstimecapsule" 
              className="block text-white text-xl font-semibold hover:text-gray-300 transition-colors duration-300 w-full text-center py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              News Time Capsule
            </Link>
            <Link 
              to="/feedback" // Added Feedback Link for mobile
              className="block text-white text-xl font-semibold hover:text-gray-300 transition-colors duration-300 w-full text-center py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Feedback
            </Link>
            
            <div className="w-full h-px bg-gray-600 my-2"></div> {/* Separator */}

            {/* User info and buttons for mobile */}
            <span className="text-lg text-gray-200">Hi, {getUsername()}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 w-3/4"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
