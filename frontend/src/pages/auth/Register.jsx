import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/ui/Button';
import { Alert } from '../../components/ui/Feedback';
import FormField from '../../components/ui/FormField';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useForm } from '../../hooks/useForm';
import { ROLES } from '../../models/constants';
import { errorMessage } from '../../utils/apiErrors';
import { email, matches, maxLength, minLength, password, passwordStrength, required } from '../../utils/validators';

const SCHEMA = {
  full_name: [required('Escribe tu nombre completo'), minLength(3), maxLength(150)],
  email: [required('Escribe tu correo'), email()],
  password: [required('Crea una contraseña'), password()],
  confirm: [required('Repite la contraseña'), matches('password', 'Las contraseñas no coinciden')],
  terms: [(v) => (v ? null : 'Debes aceptar los términos para continuar')],
};

const STRENGTH = ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Excelente'];

export default function Register() {
  useDocumentTitle('Crear cuenta');
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialRole = params.get('rol') === 'empresa' ? 'company' : 'developer';
  const { values, setValue, setErrors, validateAll, field } = useForm(
    { role: initialRole, full_name: '', email: '', password: '', confirm: '', terms: false },
    SCHEMA,
  );
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const strength = passwordStrength(values.password);
  const isCompany = values.role === 'company';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validateAll()) return;
    setBusy(true);
    try {
      await register({
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: values.role,
      });
      toast.success('¡Tu cuenta está lista! Empieza completando tu perfil.');
      navigate('/app', { replace: true });
    } catch (err) {
      // El correo repetido se muestra en su propio campo.
      if (err.code === 'email_taken') setErrors((prev) => ({ ...prev, email: errorMessage(err) }));
      else setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const termsField = field('terms');

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Es gratis y te toma menos de un minuto."
      footer={
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      }
    >
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <fieldset className="role-picker">
          <legend>¿Cómo vas a usar JuniorSwipe?</legend>
          {Object.entries(ROLES).map(([key, r]) => (
            <label key={key} className={`role-option${values.role === key ? ' selected' : ''}`}>
              <input
                type="radio"
                name="role"
                value={key}
                checked={values.role === key}
                onChange={() => setValue('role', key)}
              />
              <span className="role-title">{r.label}</span>
              <span className="role-desc">{r.description}</span>
            </label>
          ))}
        </fieldset>

        <FormField
          label={isCompany ? 'Nombre de la empresa' : 'Nombre completo'}
          autoComplete={isCompany ? 'organization' : 'name'}
          placeholder={isCompany ? 'Ej. Estudio Creativo' : 'Ej. Laura Gómez'}
          required
          {...field('full_name')}
        />
        <FormField label="Correo" type="email" autoComplete="email" placeholder="nombre@correo.com" required {...field('email')} />
        <FormField
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres, con letras y números"
          required
          {...field('password')}
        />
        {values.password && (
          <div className={`strength strength-${strength}`} aria-live="polite">
            <div className="strength-bars" aria-hidden="true">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={n <= strength ? 'on' : ''} />
              ))}
            </div>
            <span>Seguridad: {STRENGTH[strength]}</span>
          </div>
        )}
        <FormField
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          placeholder="Repite la contraseña"
          required
          {...field('confirm')}
        />

        <div className={`checkbox-field${termsField.error ? ' has-error' : ''}`}>
          <label>
            <input
              type="checkbox"
              name="terms"
              checked={values.terms}
              onChange={termsField.onChange}
              onBlur={termsField.onBlur}
            />
            Acepto los términos de uso y la política de tratamiento de datos.
          </label>
          {termsField.error && (
            <p className="field-error" role="alert">
              {termsField.error}
            </p>
          )}
        </div>

        {error && <Alert type="error">{error}</Alert>}
        <Button type="submit" block loading={busy}>
          {busy ? 'Creando tu cuenta…' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthLayout>
  );
}
