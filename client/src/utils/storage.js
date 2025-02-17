// Storage prefix to avoid conflicts with other applications.
const storagePrefix = 'nodeforum_';

// Utility object for managing token and user data in browser storage
const storage = {
  // Retrieve the authentication token from session storage
  getToken: () => {
    try {
      const token = window.sessionStorage.getItem(`${storagePrefix}token`);
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  },

  // Store the authentication token in session storage
  setToken: (token) => {
    if (token) {
      window.sessionStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
    }
  },

    // Remove the authentication token from session storage
  clearToken: () => {
    window.sessionStorage.removeItem(`${storagePrefix}token`);
  },

  // Retrieve user data from local storage
  getUser: () => {
    try {
      const user = window.localStorage.getItem(`${storagePrefix}user`);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  },

  // Store user data in local storage
  setUser: (user) => {
    if (user && typeof user === 'object') {
      const userData = {
        userId: user.userId,
        username: user.username
      };
      window.localStorage.setItem(`${storagePrefix}user`, JSON.stringify(userData));
    }
  },

  // Remove user data from local storage
  clearUser: () => {
    window.localStorage.removeItem(`${storagePrefix}user`);
  }
};

export default storage;