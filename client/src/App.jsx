import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import ThreadDetail from './Components/ThreadDetail/ThreadDetail';
import CreateThread from './Components/CreateThread/CreateThread';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    if (token && userInfo) {
      setIsAuthenticated(true);
      setCurrentUser(userInfo);
    }
  }, []);

  const handleLogin = (token, userInfo) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setIsAuthenticated(true);
    setCurrentUser(userInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <Router>
      <div>
        <Navbar 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
        />
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
      </div>
    </Router>
  );
};

export default App;