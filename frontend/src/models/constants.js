// Valores del dominio que comparte la API. La clave es lo que viaja al backend
// y el label es lo que ve la persona usuaria.

export const ROLES = {
  developer: { label: 'Talento junior', description: 'Estudiante o recién graduado que busca su primer empleo' },
  company: { label: 'Empresa', description: 'Organización que busca perfiles de entrada' },
};

export const PROJECT_STATUSES = {
  draft: { label: 'Borrador', tone: 'neutral' },
  open: { label: 'Abierto', tone: 'info' },
  active: { label: 'En curso', tone: 'brand' },
  closed: { label: 'Finalizado', tone: 'success' },
};

export const RESUME_RULES = {
  maxBytes: 5 * 1024 * 1024,
  extensions: ['.pdf', '.doc', '.docx', '.txt', '.md'],
};

export const toOptions = (map) => Object.entries(map).map(([value, { label }]) => ({ value, label }));

// Mientras la API no esté conectada, los formularios validan en el navegador y
// muestran este aviso en lugar de guardar.
export const PENDING_API_MESSAGE = 'Datos válidos. Se guardarán cuando el frontend se conecte con la API.';
