export default function Login() {
    return (
      <div className="box">
        <h1 className="title">Login</h1>
        <div className="field">
          <label className="label">Correo</label>
          <div className="control">
            <input className="input" type="email" placeholder="correo@ejemplo.com" />
          </div>
        </div>
        <div className="field">
          <label className="label">Contraseña</label>
          <div className="control">
            <input className="input" type="password" placeholder="********" />
          </div>
        </div>
        <button className="button is-link">Iniciar Sesión</button>
      </div>
    )
  }
  