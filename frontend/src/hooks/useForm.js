import { useState } from 'react';
import { validate } from '../utils/validators';

// Maneja valores, errores y campos tocados de un formulario controlado.
// schema: { campo: [reglas] } (ver utils/validators.js)
export function useForm(initialValues, schema = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, nextValues) => {
    if (!schema[name]) return null;
    const msg = validate(nextValues, { [name]: schema[name] })[name] || null;
    setErrors((prev) => ({ ...prev, [name]: msg }));
    return msg;
  };

  // setValue('campo', valor) o setValue({ campo1, campo2 }) para varios a la vez.
  // Con { touch: true } los campos se validan de inmediato (útil al elegir un archivo).
  const setValue = (nameOrPatch, value, { touch = false } = {}) => {
    const patch = typeof nameOrPatch === 'string' ? { [nameOrPatch]: value } : nameOrPatch;
    const next = { ...values, ...patch };
    setValues(next);
    if (touch) setTouched((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(patch).map((k) => [k, true])) }));
    // Se revalidan los campos tocados, incluidos los que dependen de otros (confirmar contraseña).
    Object.keys(schema).forEach((name) => {
      const changed = name in patch;
      if ((changed && (touch || touched[name])) || (!changed && touched[name] && next[name])) {
        validateField(name, next);
      }
    });
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setValue(name, type === 'checkbox' ? checked : value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, values);
  };

  // Valida todo el formulario; devuelve true si no hay errores.
  const validateAll = () => {
    const next = validate(values, schema);
    setErrors(next);
    setTouched(Object.keys(schema).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    return Object.keys(next).length === 0;
  };

  const reset = (nextValues = initialValues) => {
    setValues(nextValues);
    setErrors({});
    setTouched({});
  };

  // Atajo para conectar un campo: <FormField {...field('email')} />
  const field = (name) => ({
    name,
    value: values[name] ?? '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: touched[name] ? errors[name] : null,
  });

  return { values, errors, setValue, setValues, setErrors, validateAll, reset, field };
}
