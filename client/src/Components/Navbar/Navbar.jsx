import { Link } from 'react-router';
import PropTypes from 'prop-types';
import './Navbar.css';

// Navbar component displays links to home, login, and register pages.
// If user is authenticated, it displays a sign out button
const Navbar = ({ isAuthenticated, onLogout }) => {
    return (
        <nav className='navbar'>
            {/* Left side of navbar containing logo. */}
            <div className='navbar-left'>
                <Link to="/" className='logo-link'>
                    <h2 className='logo'>BookForum</h2>
                </Link>
            </div>
            {/* Right side of navbar containing Home, sign in, and sign out buttons. */}
            <div className='navbar-right'>
            <Link to="/">
            <button>Home</button>
            </Link>
            {/* Conditional rendering based on whether user is authenticated or not. */}
            {/* If authenticated displays Sign out */}
            {/* If not authenticated display Sign in and Register */}
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

// PropTypes for Navbar Component
Navbar.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired
};

export default Navbar;