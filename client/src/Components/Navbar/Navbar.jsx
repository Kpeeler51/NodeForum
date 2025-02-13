import { Link } from 'react-router';
import PropTypes from 'prop-types';

const Nav = ({ isAuthenticated, onLogout }) => {
    return (
        <nav className='navbar'>
            <div className='navbar-left'>
                <h2>NodeForum</h2>
                <Link to="/">Home</Link>
            </div>
            <div className='navbar-right'>
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

Nav.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired
};

export default Nav;