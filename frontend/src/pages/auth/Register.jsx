import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/ui/Button';
import { Alert } from '../../components/ui/Feedback';
import FormField from '../../components/ui/FormField';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useForm } from '../../hooks/useForm';
import { PENDING_API_MESSAGE, ROLES } from '../../models/constants';
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
  const [params] = useSearchParams();
  const initialRole = params.get('rol') === 'empresa' ? 'company' : 'developer';
  const { values, setValue, validateAll, field } = useForm(
    { role: initialRole, full_name: '', email: '', password: '', confirm: '', terms: false },
    SCHEMA,
  );
  const [sent, setSent] = useState(false);
  const strength = passwordStrength(values.password);
  const isCompany = values.role === 'company';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(false);
    if (!validateAll()) return;
    // El registro con la API se conecta en la etapa de integración.
    setSent(true);
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
          Crear cuenta
        </Button>
      </form>
    </AuthLayout>
  );
}
