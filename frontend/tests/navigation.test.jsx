import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AppLayout from '../src/components/layout/AppLayout';
import { ToastProvider } from '../src/context/ToastContext';
import NotFound from '../src/pages/NotFound';
import Dashboard from '../src/pages/app/Dashboard';
import Profile from '../src/pages/app/Profile';
import Projects from '../src/pages/app/Projects';
import Resumes from '../src/pages/app/Resumes';

function renderApp(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ToastProvider>
        <Routes>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="proyectos" element={<Projects />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="cv" element={<Resumes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>,
  );
}

describe('Navegación del área interna', () => {
  it('cambia de sección desde la barra lateral y marca el enlace activo', async () => {
    renderApp('/app');
    expect(screen.getByRole('heading', { name: /Hola/ })).toBeInTheDocument();

    const nav = screen.getByRole('navigation', { name: 'Secciones' });
    await userEvent.click(within(nav).getByRole('link', { name: /Proyectos/ }));
    expect(screen.getByRole('heading', { name: 'Mis proyectos' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: /Proyectos/ })).toHaveClass('active');

    await userEvent.click(within(nav).getByRole('link', { name: /Mi perfil/ }));
    expect(screen.getByRole('heading', { name: 'Mi perfil' })).toBeInTheDocument();
  });

  it('abre el formulario de nuevo proyecto con ?nuevo=1 y lo cierra con Escape', async () => {
    renderApp('/app/proyectos?nuevo=1');
    expect(screen.getByRole('dialog', { name: 'Nuevo proyecto' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('filtra por estado y muestra el estado vacío correspondiente', async () => {
    renderApp('/app/proyectos');
    expect(screen.getByText('Aún no tienes proyectos')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: 'En curso' }));
    expect(screen.getByRole('radio', { name: 'En curso' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('No hay proyectos que coincidan')).toBeInTheDocument();
  });

  it('la vista previa del perfil se actualiza mientras se escribe', async () => {
    renderApp('/app/perfil');
    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Laura Gómez');
    expect(screen.getByRole('heading', { name: 'Laura Gómez' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '17');
  });

  it('muestra la página 404 en rutas desconocidas', () => {
    renderApp('/no-existe');
    expect(screen.getByRole('heading', { name: 'No encontramos esta página' })).toBeInTheDocument();
  });
});
