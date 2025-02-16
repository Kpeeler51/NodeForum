import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { register, login } from '../../api/auth';
import storage from '../../utils/storage';
import './register.css'

const Register = ({ onLogin, isAuthenticated }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const clearError = () => {
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }
    
        try {
            const registerData = await register(username, email, password);
            console.log('Register response:', registerData);

            const loginData = await login(email, password);
            console.log('Login response:', loginData);

            if (loginData && loginData.token && loginData.userId && loginData.username) {
                storage.setToken(loginData.token);
                const userData = {
                    userId: loginData.userId,
                    username: loginData.username
                };
                storage.setUser(userData);
                console.log('User data set in storage:', userData);

                onLogin(loginData.token, userData);
                navigate('/');
            }
        } catch (err) {
            console.error('Registration error:', err);
            
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
                <p className="password-requirements">
                    Password must be at least 8 characters long and contain at least one uppercase letter.
                </p>
                {error && <p className="error">{error}</p>}
                <button className='register-button' type='submit'>Register</button>
                <p>
                    Already have an account? <Link to='/'>Sign in</Link>
                </p>
            </form>
        </main>
    );
};

Register.propTypes = {
    onLogin: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
};

export default Register;