import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/ui/Button';
import { Alert } from '../../components/ui/Feedback';
import FormField from '../../components/ui/FormField';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useForm } from '../../hooks/useForm';
import { PENDING_API_MESSAGE } from '../../models/constants';
import { email, required } from '../../utils/validators';

const SCHEMA = {
  email: [required('Escribe tu correo'), email()],
  password: [required('Escribe tu contraseña')],
};

export default function Login() {
  useDocumentTitle('Iniciar sesión');
  const { validateAll, field } = useForm({ email: '', password: '' }, SCHEMA);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(false);
    if (!validateAll()) return;
    // La autenticación con la API se conecta en la etapa de integración.
    setSent(true);
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
        {sent && (
          <Alert
            type="info"
            title="Formulario válido"
            action={
              <Link to="/app" className="btn btn-ghost btn-sm">
                Ver panel
              </Link>
            }
          >
            {PENDING_API_MESSAGE}
          </Alert>
        )}
        <Button type="submit" block>
          Iniciar sesión
        </Button>
      </form>
    </AuthLayout>
  );
}
