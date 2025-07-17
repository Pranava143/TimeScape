// auth.js
// This file handles user registration, login, logout, and session management using localStorage.

/**
 * Registers a new user by storing their username, email, and password in localStorage.
 * In a real application, passwords should always be hashed before storage.
 * @param {string} username - The username for the new user.
 * @param {string} email - The email for the new user.
 * @param {string} password - The password for the new user.
 * @returns {{success: boolean, message: string}} - An object indicating success or failure and a message.
 */
export const registerUser = (username, email, password) => {
  // Check if a user with this username already exists
  if (localStorage.getItem(`whatif_user_${username}`)) {
    return { success: false, message: "Username already exists. Please choose a different one." };
  }

  // Store user data. In a real app, hash the password!
  const userData = { username, email, password };
  localStorage.setItem(`whatif_user_${username}`, JSON.stringify(userData));

  return { success: true, message: "Registration successful!" };
};

/**
 * Logs in a user by validating their username and password against stored data.
 * @param {string} username - The username provided by the user.
 * @param {string} password - The password provided by the user.
 * @returns {{success: boolean, message: string}} - An object indicating success or failure and a message.
 */
export const loginUser = (username, password) => {
  const storedUser = localStorage.getItem(`whatif_user_${username}`);

  if (!storedUser) {
    return { success: false, message: "Invalid username or password." };
  }

  const userData = JSON.parse(storedUser);

  // In a real application, you would compare hashed passwords here.
  // For this example, we compare plain text passwords.
  if (userData.password === password) {
    // Store current session info. In a real app, this would be a secure token.
    localStorage.setItem("whatif_current_user", username);
    return { success: true, message: "Login successful!" };
  } else {
    return { success: false, message: "Invalid username or password." };
  }
};

/**
 * Checks if a user is currently logged in.
 * @returns {boolean} - True if a user is logged in, false otherwise.
 */
export const isLoggedIn = () => {
  return !!localStorage.getItem("whatif_current_user");
};

/**
 * Logs out the current user by removing their session information from localStorage.
 */
export const logout = () => {
  localStorage.removeItem("whatif_current_user");
};

/**
 * Gets the username of the currently logged-in user.
 * @returns {string|null} - The username if logged in, otherwise null.
 */
export const getUsername = () => {
  return localStorage.getItem("whatif_current_user");
};
