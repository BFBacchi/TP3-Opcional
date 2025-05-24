import { Outlet, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="container mt-5 ">
      <nav className="navbar hero mb-3">
        <div className="navbar-brand">
          <Link to="/" className="hero-title">
            <a className="navbar-item" href="../">
              <img src="https://bulma.io/assets/images/bulma-type-white.png" alt="Logo" />
            </a>
          </Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            {!user && (
              <>
                <Link to="/login" className="button is-white is-outlined mr-4">Login</Link>
                <Link to="/register" className="button is-white is-outlined">Registro</Link>
              </>
            )}
            {user && (
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