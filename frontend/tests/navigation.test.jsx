import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AppLayout from '../src/components/layout/AppLayout';
import { ProtectedRoute } from '../src/components/layout/RouteGuards';
import NotFound from '../src/pages/NotFound';
import Dashboard from '../src/pages/app/Dashboard';
import Profile from '../src/pages/app/Profile';
import ProjectDetail from '../src/pages/app/ProjectDetail';
import Projects from '../src/pages/app/Projects';
import Resumes from '../src/pages/app/Resumes';
import { DEV_USER, json, login, mockApi, renderWithProviders, sessionRoutes } from './helpers';

const COMPANY = { ...DEV_USER, id: 2, email: 'company@local.test', full_name: 'Estudio Creativo', role: 'company' };

const PROJECT = {
  id: 7,
  title: 'Rebranding de cafetería',
  description: 'Proyecto de grado',
  status: 'active',
  tech_stack: 'Figma, Illustrator',
  task_count: 2,
  created_at: '2026-11-10T10:00:00',
};

const TASKS = [
  { id: 1, project_id: 7, title: 'Investigación de marca', status: 'done', priority: 'high', due_date: null },
  { id: 2, project_id: 7, title: 'Diseño del logotipo', status: 'todo', priority: 'medium', due_date: null },
];

function renderApp(route) {
  return renderWithProviders(
    <Routes>
      <Route path="/login" element={<p>Pantalla de inicio de sesión</p>} />
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="proyectos" element={<Projects />} />
        <Route path="proyectos/:id" element={<ProjectDetail />} />
        <Route path="perfil" element={<Profile />} />
        <Route path="cv" element={<ProtectedRoute roles={['developer']}><Resumes /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>,
    { route },
  );
}

const list = (items) => ({ items, page: 1, per_page: 9, total: items.length });

describe('Sesión y rutas protegidas', () => {
  it('sin sesión, el área interna redirige al inicio de sesión', async () => {
    mockApi({});
    renderApp('/app/proyectos');
    expect(await screen.findByText('Pantalla de inicio de sesión')).toBeInTheDocument();
  });

  it('una cuenta de empresa no ve la sección de CV', async () => {
    login(COMPANY);
    mockApi({ ...sessionRoutes(COMPANY), 'GET /api/resumes': () => list([]) });
    renderApp('/app/cv');
    expect(await screen.findByText('Esta sección no está disponible para tu cuenta')).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Secciones' });
    expect(within(nav).queryByRole('link', { name: /Mis CV/ })).not.toBeInTheDocument();
  });

  it('muestra la página 404 en rutas desconocidas', () => {
    renderApp('/no-existe');
    expect(screen.getByRole('heading', { name: 'No encontramos esta página' })).toBeInTheDocument();
  });
});

describe('Panel y navegación', () => {
  it('muestra el resumen con datos de la API y navega por la barra lateral', async () => {
    login();
    mockApi({
      ...sessionRoutes(),
      'GET /api/users/me': () => ({ ...DEV_USER, project_count: 1, resume_count: 0 }),
      'GET /api/projects': () => list([PROJECT]),
      'GET /api/tasks': () => list(TASKS),
    });
    renderApp('/app');
    expect(await screen.findByRole('heading', { name: /Hola, Laura/ })).toBeInTheDocument();
    expect(await screen.findByText('1/2')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Rebranding de cafetería' })).toBeInTheDocument();

    const nav = screen.getByRole('navigation', { name: 'Secciones' });
    await userEvent.click(within(nav).getByRole('link', { name: /Proyectos/ }));
    expect(await screen.findByRole('heading', { name: 'Mis proyectos' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /Proyectos/ })).toHaveClass('active');
  });
});

describe('Proyectos', () => {
  it('lista, filtra por estado y busca enviando los parámetros a la API', async () => {
    login();
    const api = mockApi({ ...sessionRoutes(), 'GET /api/projects': () => list([PROJECT]) });
    renderApp('/app/proyectos');
    expect(await screen.findByText('Rebranding de cafetería')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', { name: 'Finalizado' }));
    await waitFor(() => expect(api.mock.calls.some(([u]) => String(u).includes('status=closed'))).toBe(true));

    await userEvent.type(screen.getByRole('searchbox'), 'cafe');
    await waitFor(() => expect(api.mock.calls.some(([u]) => String(u).includes('q=cafe'))).toBe(true));
  });

  it('crea un proyecto desde el modal y recarga la lista', async () => {
    login();
    let created = false;
    const api = mockApi({
      ...sessionRoutes(),
      'GET /api/projects': () => list(created ? [PROJECT] : []),
      'POST /api/projects': () => {
        created = true;
        return json(PROJECT, 201);
      },
    });
    renderApp('/app/proyectos?nuevo=1');
    const dialog = await screen.findByRole('dialog', { name: 'Nuevo proyecto' });
    await userEvent.type(within(dialog).getByLabelText(/Título/), 'Rebranding de cafetería');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Crear proyecto' }));
    expect(await screen.findByText('Proyecto creado.')).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: 'Rebranding de cafetería' })).toBeInTheDocument();
    const post = api.mock.calls.find(([, o]) => o?.method === 'POST');
    expect(JSON.parse(post[1].body).title).toBe('Rebranding de cafetería');
  });

  it('pide confirmación antes de eliminar', async () => {
    login();
    const api = mockApi({
      ...sessionRoutes(),
      'GET /api/projects': () => list([PROJECT]),
      'DELETE /api/projects/7': () => json(null, 204),
    });
    renderApp('/app/proyectos');
    await userEvent.click(await screen.findByRole('button', { name: 'Eliminar Rebranding de cafetería' }));
    const dialog = screen.getByRole('dialog', { name: 'Eliminar proyecto' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Eliminar' }));
    expect(await screen.findByText('Proyecto eliminado.')).toBeInTheDocument();
    expect(api.mock.calls.some(([, o]) => o?.method === 'DELETE')).toBe(true);
  });

  it('el detalle avanza el estado de una actividad', async () => {
    login();
    const api = mockApi({
      ...sessionRoutes(),
      'GET /api/projects/7': () => ({ ...PROJECT, tasks: TASKS }),
      'PATCH /api/tasks/2': () => ({ ...TASKS[1], status: 'in_progress' }),
    });
    renderApp('/app/proyectos/7');
    expect(await screen.findByRole('heading', { name: 'Rebranding de cafetería' })).toBeInTheDocument();
    expect(screen.getByText('1 de 2 actividades hechas')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Diseño del logotipo: Por hacer/ }));
    await waitFor(() => {
      const patch = api.mock.calls.find(([, o]) => o?.method === 'PATCH');
      expect(JSON.parse(patch[1].body)).toEqual({ status: 'in_progress' });
    });
  });

  it('un proyecto inexistente muestra un mensaje claro', async () => {
    login();
    mockApi({ ...sessionRoutes() });
    renderApp('/app/proyectos/999');
    expect(await screen.findByText('No encontramos este proyecto')).toBeInTheDocument();
  });
});

describe('Perfil', () => {
  it('carga el perfil, actualiza la vista previa y guarda', async () => {
    login();
    const api = mockApi({
      ...sessionRoutes(),
      'GET /api/profiles/me': () => ({ headline: 'Diseñadora', bio: '', location: '', website: '', skills: ['Figma'] }),
      'PUT /api/profiles/me': (_u, o) => JSON.parse(o.body),
    });
    renderApp('/app/perfil');
    const city = await screen.findByLabelText('Ciudad');
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Laura Gómez');
    await userEvent.type(city, 'Bogotá');
    expect(screen.getByText(/📍 Bogotá/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Guardar perfil' }));
    expect(await screen.findByText('Perfil guardado.')).toBeInTheDocument();
    const put = api.mock.calls.find(([, o]) => o?.method === 'PUT');
    expect(JSON.parse(put[1].body)).toMatchObject({ headline: 'Diseñadora', location: 'Bogotá', skills: ['Figma'] });
  });
});
