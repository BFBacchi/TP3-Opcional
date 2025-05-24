import { useState } from 'react';
import { login } from '../../config/auth'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom'; // Importa el hook

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Inicializa el hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await login(email, password);
      setSuccess('¡Bienvenido!');
      navigate('/'); // Redirige a Home
    } catch (err) {
      console.error(err);
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="box">
      <h1 className="title">Login</h1>
      <form onSubmit={handleSubmit}>
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
        <button className="button is-link" type="submit">Iniciar Sesión</button>
        {error && <p className="has-text-danger">{error}</p>}
        {success && <p className="has-text-success">{success}</p>}
      </form>
    </div>
  );
}