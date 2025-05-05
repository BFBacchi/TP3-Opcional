export default function Register() {
    return (
      <div className="box">
        <h1 className="title">Registro</h1>
        <div className="field">
          <label className="label">Nombre</label>
          <div className="control">
            <input className="input" type="text" placeholder="Tu nombre" />
          </div>
        </div>
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
        <button className="button is-primary">Registrarse</button>
      </div>
    )
  }
  