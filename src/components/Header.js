import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header>
            <nav>
                <Link to="/">Home</Link>
                {user ? (
                    <>
                        <Link to="/tasks">Tasks</Link>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
};



export default Header;