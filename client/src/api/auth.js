// Base URL for API requests. Set inside of a .env file. falls back to localhost:3000.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Attempts to log the user in with the provided credentials.
export const login = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    return response.json();
  };
  // Attempts to register a new user with the provided credentials.
export const register = async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    return response.json();
  };