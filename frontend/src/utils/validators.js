// Reglas de validación reutilizables. Cada regla recibe el valor (y opcionalmente
// todos los valores del formulario) y devuelve un mensaje de error o null.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/i;

const isEmpty = (v) => v === undefined || v === null || String(v).trim() === '';

export const required = (msg = 'Este campo es obligatorio') => (v) => (isEmpty(v) ? msg : null);

export const minLength = (n, msg) => (v) =>
  !isEmpty(v) && String(v).trim().length < n ? msg || `Escribe al menos ${n} caracteres` : null;

export const maxLength = (n, msg) => (v) =>
  !isEmpty(v) && String(v).length > n ? msg || `Máximo ${n} caracteres` : null;

export const email = (msg = 'Escribe un correo válido, por ejemplo nombre@correo.com') => (v) =>
  !isEmpty(v) && !EMAIL_RE.test(String(v).trim()) ? msg : null;

export const url = (msg = 'Escribe una URL válida que empiece por http:// o https://') => (v) =>
  !isEmpty(v) && !URL_RE.test(String(v).trim()) ? msg : null;

export const password = () => (v) => {
  if (isEmpty(v)) return null;
  if (v.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Combina letras y números';
  return null;
};

export const matches = (field, msg = 'Los valores no coinciden') => (v, all) =>
  !isEmpty(v) && v !== all?.[field] ? msg : null;

export const notPastDate = (msg = 'La fecha no puede estar en el pasado') => (v) => {
  if (isEmpty(v)) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${v}T00:00:00`) < today ? msg : null;
};

export const fileType = (extensions, msg) => (file) => {
  if (!file) return null;
  const name = file.name.toLowerCase();
  return extensions.some((ext) => name.endsWith(ext))
    ? null
    : msg || `Formato no permitido. Usa: ${extensions.join(', ')}`;
};

export const fileSize = (maxBytes, msg) => (file) =>
  file && file.size > maxBytes ? msg || `El archivo supera ${Math.round(maxBytes / 1024 / 1024)} MB` : null;

// Ejecuta las reglas de un esquema { campo: [reglas] } y devuelve { campo: mensaje }.
export function validate(values, schema) {
  const errors = {};
  for (const [field, rules] of Object.entries(schema)) {
    for (const rule of rules) {
      const msg = rule(values[field], values);
      if (msg) {
        errors[field] = msg;
        break;
      }
    }
  }
  return errors;
}

// Nivel de seguridad de una contraseña de 0 a 4, para la barra del registro.
export function passwordStrength(v = '') {
  let score = 0;
  if (v.length >= 8) score += 1;
  if (v.length >= 12) score += 1;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score += 1;
  if (/\d/.test(v) && /[^A-Za-z0-9]/.test(v)) score += 1;
  return score;
}
