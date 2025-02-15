import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { register, login } from '../../api/auth';

const Register = ({ onLogin, isAuthenticated }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await register(username, email, password);
        const loginData = await login(email, password);
        onLogin(loginData.token);
        navigate('/');
    } catch (err) {
        console.error('Registration error:', err);
        console.log('Error response:', err.response);
        
        if (err.response && err.response.data) {
            console.log('Error data:', err.response.data);
            
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

    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    return (
        <main className='register'>
            <h1 className='registerheader'>Create an account</h1>
            <form className='registerform' onSubmit={handleSubmit}>
                <label htmlFor='username'>Username</label>
                <input
                    type='text'
                    name='username'
                    id='username'
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
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
                <button className='registerbutton' type='submit'>Register</button>
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