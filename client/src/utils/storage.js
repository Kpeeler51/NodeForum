const storagePrefix = 'nodeforum_';

const storage = {
  getToken: () => {
    return JSON.parse(window.sessionStorage.getItem(`${storagePrefix}token`));
  },
  setToken: (token) => {
    window.sessionStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },
  clearToken: () => {
    window.sessionStorage.removeItem(`${storagePrefix}token`);
  },
  getUser: () => {
    const user = window.localStorage.getItem(`${storagePrefix}user`);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => {
    window.localStorage.setItem(`${storagePrefix}user`, JSON.stringify(user));
  },
  clearUser: () => {
    window.localStorage.removeItem(`${storagePrefix}user`);
  }
};

export default storage;
