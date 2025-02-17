import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { login } from '../../api/auth';
import storage from '../../utils/storage';
import './Login.css'

// Login component renders a login form and handles user authentication.
// On sucessful login redirects user to the home page. An unsuccessful login displays an error message.
const Login = ({ onLogin, isAuthenticated }) => {
    // state management for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
// Redirect to home if user is authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // handles form submission for user login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
    
            if (data && data.token && data.userId && data.username) {
                // Store authentication data and update app state
                storage.setToken(data.token);
                const userData = {
                    userId: data.userId,
                    username: data.username
                };
                storage.setUser(userData);
                onLogin(data.token, userData);
                navigate('/');
            } else {
                console.error('Invalid login response:');
                setError('Login failed: Invalid response from server');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid email or password');
        }
    };

    return (
        <main className='login'>
            <h1 className='login-header'>Log into your account</h1>
            <form className='loginform' onSubmit={handleSubmit}>
                {/* Email input field */}
                <label htmlFor='email'>Email Address</label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {/* Password input field */}
                <label htmlFor='password'>Password</label>
                <input
                    type='password'
                    name='password'
                    id='password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {/* Display error messages. */}
                {error && <p className="error">{error}</p>}
                <button className='loginBtn' type="submit">SIGN IN</button>
                {/* Registration link. */}
                <p>
                    Don&#39;t have an account? <Link to='/register'>Create one</Link>
                </p>
            </form>
        </main>
    );
};

// PropTypes for Login component
Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
};

export default Login;