import { Link } from 'react-router';
import PropTypes from 'prop-types';
import './Navbar.css';

const Navbar = ({ isAuthenticated, onLogout }) => {
    return (
        <nav className='navbar'>
            <div className='navbar-left'>
                <Link to="/" className='logo-link'>
                    <h2 className='logo'>BookForum</h2>
                </Link>
            </div>
            <div className='navbar-right'>
            <Link to="/">
            <button>Home</button>
            </Link>
                {isAuthenticated ? (
                    <button onClick={onLogout}>Sign out</button>
                ) : (
                    <>
                        <Link to="/login">
                            <button>Sign in</button>
                        </Link>
                        <Link to="/register">
                            <button>Register</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired
};

export default Navbar;