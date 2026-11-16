import { useId, useState } from 'react';

// Campo de formulario accesible: label, control, ayuda y mensaje de error.
// as: 'input' | 'textarea' | 'select'. Para select, pasa las <option> como children.
export default function FormField({
  label,
  as = 'input',
  type = 'text',
  hint,
  error,
  required,
  className = '',
  children,
  ...props
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  const isPassword = type === 'password';

  const control = {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    required,
    ...props,
  };

  let input;
  if (as === 'textarea') input = <textarea rows={4} {...control} />;
  else if (as === 'select') input = <select {...control}>{children}</select>;
  else input = <input type={isPassword && visible ? 'text' : type} {...control} />;

  return (
    <div className={`field${error ? ' has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id}>
          {label}
          {required && <span className="field-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <div className={`field-control${isPassword ? ' with-action' : ''}`}>
        {input}
        {isPassword && (
          <button
            type="button"
            className="field-action"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {visible ? 'Ocultar' : 'Ver'}
          </button>
        )}
      </div>
      {hint && !error && (
        <p className="field-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
