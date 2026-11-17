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

export const TASK_STATUSES = {
  todo: { label: 'Por hacer', tone: 'neutral' },
  in_progress: { label: 'En progreso', tone: 'warning' },
  done: { label: 'Hecha', tone: 'success' },
};

// Orden en el que avanza una actividad al hacer clic en su estado.
export const NEXT_TASK_STATUS = { todo: 'in_progress', in_progress: 'done', done: 'todo' };

export const TASK_PRIORITIES = {
  low: { label: 'Baja', tone: 'neutral' },
  medium: { label: 'Media', tone: 'info' },
  high: { label: 'Alta', tone: 'error' },
};

export const RESUME_RULES = {
  maxBytes: 5 * 1024 * 1024,
  extensions: ['.pdf', '.doc', '.docx', '.txt', '.md'],
};

// Cuentas que crea el backend al arrancar (SEED_ON_STARTUP). Solo para desarrollo.
export const DEMO_ACCOUNTS = [
  { role: 'developer', email: 'dev@local.test', password: 'Password123!' },
  { role: 'company', email: 'company@local.test', password: 'Password123!' },
];

export const PROJECTS_PER_PAGE = 9;

export const toOptions = (map) => Object.entries(map).map(([value, { label }]) => ({ value, label }));
