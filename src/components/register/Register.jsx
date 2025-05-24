import { useState } from 'react';
import { register } from '../../config/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(email, password);
      setSuccess('Usuario registrado correctamente');
    } catch (err) {
      setError('Error al registrar: ' + err.message);
    }
  };

  return (
    <div className="box">
      <h1 className="title">Registro</h1>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Nombre</label>
          <div className="control">
            <input className="input" type="text" placeholder="Tu nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          </div>
        </div>
        <div className="field">
          <label className="label">Correo</label>
          <div className="control">
            <input className="input" type="email" placeholder="correo@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className="field">
          <label className="label">Contraseña</label>
          <div className="control">
            <input className="input" type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
        </div>
        <button className="button is-primary" type="submit">Registrarse</button>
        {error && <p className="has-text-danger">{error}</p>}
        {success && <p className="has-text-success">{success}</p>}
      </form>
    </div>
  );
}