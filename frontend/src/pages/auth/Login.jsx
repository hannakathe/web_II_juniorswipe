import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/ui/Button';
import { Alert } from '../../components/ui/Feedback';
import FormField from '../../components/ui/FormField';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useForm } from '../../hooks/useForm';
import { DEMO_ACCOUNTS, ROLES } from '../../models/constants';
import { errorMessage } from '../../utils/apiErrors';
import { email, required } from '../../utils/validators';

const SCHEMA = {
  email: [required('Escribe tu correo'), email()],
  password: [required('Escribe tu contraseña')],
};

export default function Login() {
  useDocumentTitle('Iniciar sesión');
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, setValues, validateAll, field } = useForm({ email: '', password: '' }, SCHEMA);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateAll()) return;
    setBusy(true);
    try {
      const user = await login(values.email.trim(), values.password);
      toast.success(`¡Hola, ${user.full_name.split(' ')[0]}!`);
      navigate(location.state?.from || '/app', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Bienvenida de vuelta"
      subtitle="Inicia sesión para seguir construyendo tu perfil."
      footer={
        <p>
          ¿Aún no tienes cuenta? <Link to="/register">Regístrate gratis</Link>
        </p>
      }
    >
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <FormField label="Correo" type="email" autoComplete="email" placeholder="nombre@correo.com" required {...field('email')} />
        <FormField
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          placeholder="Tu contraseña"
          required
          {...field('password')}
        />
        {error && <Alert type="error">{error}</Alert>}
        <Button type="submit" block loading={busy}>
          {busy ? 'Entrando…' : 'Iniciar sesión'}
        </Button>
      </form>

      <div className="demo-accounts">
        <p className="eyebrow">Cuentas de prueba (desarrollo)</p>
        <div className="demo-buttons">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.email}
              type="button"
              className="chip"
              onClick={() => setValues({ email: a.email, password: a.password })}
            >
              {ROLES[a.role].label}
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
