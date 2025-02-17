import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { register, login } from '../../api/auth';
import storage from '../../utils/storage';
import './Register.css'

// Register component renders a registration form for users to create an account.
// Handles user registration and logs them in unpon account creation.
const Register = ({ onLogin, isAuthenticated }) => {
    // State management for form inputs and error handling.
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Redirects to home if user is authenticated.
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Clears error message when user starts typing.
    const clearError = () => {
        setError("");
    };

    // Handles form submission for user registration.
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate password before submission.
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }
    
        try {
            // Attempts to register user based on username, email, and password.
            await register(username, email, password);
            // If sucessful log the user in.
            const loginData = await login(email, password);
        
            if (loginData && loginData.token && loginData.userId && loginData.username) {
                // Store authentication data and update app state
                storage.setToken(loginData.token);
                const userData = {
                    userId: loginData.userId,
                    username: loginData.username
                };
                storage.setUser(userData);
        
                onLogin(loginData.token, userData);
                navigate('/');
            }
        } catch (err) {
            console.error('Registration error occurred');
             // Handle different types of registration errors
            if (err.response && err.response.data) {
                if (err.response.data.field === 'username') {
                    setError('Username already exists. Please choose a different username.');
                } else if (err.response.data.field === 'email') {
                    setError('Email already taken. Please use a different email address.');
                } else if (err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError('Registration failed. Please try again.');
                }
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };
    // Password is validated based on length and uppercase criteria.
    // 8 characters or more and at least 1 uppercase letter.
    const validatePassword = (password) => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        return null;
    };

    if (isAuthenticated) {
        return null;
    }

    return (
        <main className='register'>
            <h1 className='register-header'>Create an account</h1>
            <form className='register-form' onSubmit={handleSubmit}>
                {/* Username input field */}
                <label htmlFor='username'>Username</label>
                <input
                    type='text'
                    name='username'
                    id='username'
                    required
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        clearError();
                    }}
                />
                {/* Email input field */}
                <label htmlFor='email'>Email Address</label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    required
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        clearError();
                    }}
                />
                {/* Password input field */}
                <label htmlFor='password'>Password</label>
                <input
                    type='password'
                    name='password'
                    id='password'
                    required
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        clearError();
                    }}
                />
                {/* Informs user of password requirements. */}
                <p className="password-requirements">
                    Password must be at least 8 characters long and contain at least one uppercase letter.
                </p>
                {/* Error message display */}
                {error && <p className="error">{error}</p>}
                <button className='register-button' type='submit'>Register</button>
                {/* Link to login page */}
                <p>
                    Already have an account? <Link to='/'>Sign in</Link>
                </p>
            </form>
        </main>
    );
};

// PropTypes validation for Register component
Register.propTypes = {
    onLogin: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
};

export default Register;