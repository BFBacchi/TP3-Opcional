import { Outlet, Link } from 'react-router-dom';
import { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import { CartContext } from './context/CartContext';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { currentUser } = useAuth();
  const { getItemCount } = useContext(CartContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="container mt-5 ">
      <nav className="navbar hero mb-3">
        <div className="navbar-brand">
          <Link to="/" className="hero-title">
            <span className="navbar-item">
              <img src="https://bulma.io/assets/images/bulma-type-white.png" alt="Logo" />
            </span>
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <Link to="/cart" className="navbar-item">
              <span className="icon">
                <i className="fas fa-shopping-cart"></i>
              </span>
              <span>Carrito ({getItemCount()})</span>
            </Link>
            {!currentUser && (
              <>
                <Link to="/login" className="button is-white is-outlined mr-4">Login</Link>
                <Link to="/register" className="button is-white is-outlined">Registro</Link>
              </>
            )}
            {currentUser && (
              <>
                <button className="button is-danger mr-4" onClick={handleLogout}>Logout</button>
                <Link to="/backoffice" className="button is-warning">Backoffice</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}