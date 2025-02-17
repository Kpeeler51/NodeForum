import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import ThreadDetail from './Components/ThreadDetail/ThreadDetail';
import CreateThread from './Components/CreateThread/CreateThread';
import Footer from './Components/Footer/Footer';
import storage from './utils/storage';

// Main App component that handles routing and authentication state
const App = () => {

  // State for tracking authentication status and current user
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check for existing authentication on component mount
  useEffect(() => {
    const token = storage.getToken();
    const userInfo = storage.getUser();
    if (token && userInfo) {
      setIsAuthenticated(true);
      setCurrentUser(userInfo);
    }
  }, []);

  // Handle user login, sets token and user in local storage and updates state
  const handleLogin = (token, userInfo) => {
    storage.setToken(token);
    storage.setUser(userInfo);
    setIsAuthenticated(true);
    setCurrentUser(userInfo);
  };

  // Handle user logout, clears token and user from local storage and updates state
  const handleLogout = () => {
    storage.clearToken();
    storage.clearUser();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <div>
        {/* naviation bar with authentication states */}
        <Navbar 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
        />
        {/* Route configuration. "/" leads back to the home page. */}
        <Routes>
          <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
          <Route 
            path="/login" 
            element={<Login onLogin={handleLogin} isAuthenticated={isAuthenticated} />} 
          />
          <Route 
            path="/register" 
            element={<Register onLogin={handleLogin} isAuthenticated={isAuthenticated} />} 
          />
          <Route 
            path="/thread/:id" 
            element={<ThreadDetail currentUser={currentUser} />} 
          />
          <Route path="/create-thread" element={<CreateThread />} />
        </Routes>
        {/* Footer component */}
        <Footer/>
      </div>
    </Router>
  );
};

export default App;