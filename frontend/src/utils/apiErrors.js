// Traduce los códigos de error de la API a mensajes claros para la persona usuaria.
const MESSAGES = {
  network_error: 'No pudimos conectar con el servidor. Revisa que la API esté encendida e inténtalo de nuevo.',
  invalid_credentials: 'El correo o la contraseña no son correctos.',
  email_taken: 'Ya existe una cuenta con ese correo. Prueba iniciar sesión.',
  token_expired: 'Tu sesión expiró. Inicia sesión de nuevo.',
  token_invalid: 'Tu sesión no es válida. Inicia sesión de nuevo.',
  token_missing: 'Necesitas iniciar sesión para continuar.',
  user_not_found: 'Tu cuenta ya no existe. Inicia sesión con otra cuenta.',
  forbidden: 'Tu tipo de cuenta no tiene permiso para hacer esto.',
  not_found: 'No encontramos lo que buscas. Puede que se haya eliminado.',
  unsupported_type: 'Ese tipo de archivo no está permitido.',
  request_entity_too_large: 'El archivo es demasiado grande.',
  internal_error: 'Algo falló en el servidor. Inténtalo de nuevo en unos minutos.',
};

export function errorMessage(err, fallback = 'Ocurrió un error inesperado.') {
  if (!err) return fallback;
  if (err.code && MESSAGES[err.code]) return MESSAGES[err.code];
  return err.message || fallback;
}
