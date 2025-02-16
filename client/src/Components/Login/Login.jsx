import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { login } from '../../api/auth';
import storage from '../../utils/storage';

const Login = ({ onLogin, isAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            console.log('Login response:', data);
    
            if (data && data.token && data.userId && data.username) {
                storage.setToken(data.token);
                const userData = {
                    userId: data.userId,
                    username: data.username
                };
                storage.setUser(userData);
                console.log('User data set in storage:', userData);
                onLogin(data.token, userData);
                navigate('/');
            } else {
                console.error('Invalid login response:', data);
                setError('Login failed: Invalid response from server');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid email or password');
        }
    };

    return (
        <main className='login'>
            <h1 className='loginheader'>Log into your account</h1>
            <form className='loginform' onSubmit={handleSubmit}>
                <label htmlFor='email'>Email Address</label>
                <input
                    type='email'
                    name='email'
                    id='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor='password'>Password</label>
                <input
                    type='password'
                    name='password'
                    id='password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className="error">{error}</p>}
                <button className='loginBtn' type="submit">SIGN IN</button>
                <p>
                    Don&#39;t have an account? <Link to='/register'>Create one</Link>
                </p>
            </form>
        </main>
    );
};

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
};

export default Login;