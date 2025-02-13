import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;