import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../src/context/AuthContext';
import { ToastProvider } from '../src/context/ToastContext';

export const DEV_USER = {
  id: 1,
  email: 'dev@local.test',
  full_name: 'Laura Gómez',
  role: 'developer',
  profile: { headline: '', bio: '', location: '', website: '', skills: [] },
};

export const json = (body, status = 200) =>
  Promise.resolve(new Response(status === 204 ? null : JSON.stringify(body), { status }));

// Simula la API: routes es { 'GET /api/projects': (url, opts) => respuesta }.
// La clave se compara con el método y la ruta sin parámetros de consulta.
export function mockApi(routes) {
  const fetchMock = vi.fn((input, opts = {}) => {
    const url = new URL(String(input));
    const key = `${opts.method || 'GET'} ${url.pathname}`;
    const handler = routes[key];
    if (!handler) return json({ error: { code: 'not_found', message: `Sin mock para ${key}` } }, 404);
    const result = handler(url, opts);
    return result instanceof Promise ? result : json(result);
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

// Respuestas mínimas para una sesión iniciada.
export function sessionRoutes(user = DEV_USER) {
  return { 'GET /api/auth/me': () => user };
}

export function login(user = DEV_USER) {
  localStorage.setItem('juniorswipe_token', 'token-de-prueba');
  localStorage.setItem('juniorswipe_user', JSON.stringify(user));
}

export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ToastProvider>
        <AuthProvider>{ui}</AuthProvider>
      </ToastProvider>
    </MemoryRouter>,
  );
}
