import { Outlet, Link } from 'react-router-dom'

export default function App() {
  return (
    <div className="container mt-5 ">
      <nav className="navbar hero mb-3">
        <div className="navbar-brand">
          <Link to="/" className="hero-title">  <a class="navbar-item" href="../">
                            <img src="https://bulma.io/assets/images/bulma-type-white.png" alt="Logo" />
                        </a></Link>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            <Link to="/login" className="button is-white is-outlined mr-4">Login</Link>
            <Link to="/register" className="button is-white is-outlined">Registro</Link>
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  )
}
