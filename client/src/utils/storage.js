const storagePrefix = 'nodeforum_';

const storage = {
  getToken: () => {
    try {
      const token = window.sessionStorage.getItem(`${storagePrefix}token`);
      return token ? JSON.parse(token) : null;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  },
  setToken: (token) => {
    if (token) {
      window.sessionStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
    }
  },
  clearToken: () => {
    window.sessionStorage.removeItem(`${storagePrefix}token`);
  },
  getUser: () => {
    try {
      const user = window.localStorage.getItem(`${storagePrefix}user`);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user:', error);
      return null;
    }
  },
  setUser: (user) => {
    if (user && typeof user === 'object') {
      const userData = {
        userId: user.userId,
        username: user.username
      };
      window.localStorage.setItem(`${storagePrefix}user`, JSON.stringify(userData));
    }
  },
  clearUser: () => {
    window.localStorage.removeItem(`${storagePrefix}user`);
  }
};

export default storage;