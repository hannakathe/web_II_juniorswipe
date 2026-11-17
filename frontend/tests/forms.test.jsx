import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ProjectForm from '../src/components/projects/ProjectForm';
import ResumeUploadForm from '../src/components/resumes/ResumeUploadForm';
import Login from '../src/pages/auth/Login';
import Register from '../src/pages/auth/Register';
import { DEV_USER, json, mockApi, renderWithProviders } from './helpers';

// Login y registro dentro de un router mínimo para ver a dónde redirigen.
const renderAuth = (page, route) =>
  renderWithProviders(
    <Routes>
      <Route path="/login" element={page} />
      <Route path="/register" element={page} />
      <Route path="/app" element={<p>Panel cargado</p>} />
    </Routes>,
    { route },
  );

describe('Inicio de sesión', () => {
  it('muestra errores si se envía vacío y no llama a la API', async () => {
    const api = mockApi({});
    renderAuth(<Login />, '/login');
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(screen.getByText('Escribe tu correo')).toBeInTheDocument();
    expect(screen.getByText('Escribe tu contraseña')).toBeInTheDocument();
    expect(api).not.toHaveBeenCalled();
  });

  it('valida el formato del correo al salir del campo', async () => {
    renderAuth(<Login />, '/login');
    await userEvent.type(screen.getByLabelText(/Correo/), 'laura@correo');
    await userEvent.tab();
    expect(screen.getByText(/Escribe un correo válido/)).toBeInTheDocument();
  });

  it('muestra en español el error de credenciales de la API', async () => {
    mockApi({
      'POST /api/auth/login': () =>
        json({ error: { code: 'invalid_credentials', message: 'Correo o contraseña incorrectos' } }, 401),
    });
    renderAuth(<Login />, '/login');
    await userEvent.type(screen.getByLabelText(/Correo/), 'laura@correo.com');
    await userEvent.type(screen.getByLabelText(/^Contraseña/), 'Equivocada1');
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(await screen.findByText('El correo o la contraseña no son correctos.')).toBeInTheDocument();
  });

  it('guarda el token y entra al panel con credenciales válidas', async () => {
    const api = mockApi({
      'POST /api/auth/login': () => ({ token: 'jwt-1', user: DEV_USER }),
      'GET /api/auth/me': () => DEV_USER,
    });
    renderAuth(<Login />, '/login');
    await userEvent.click(screen.getByRole('button', { name: 'Talento junior' }));
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(await screen.findByText('Panel cargado')).toBeInTheDocument();
    expect(localStorage.getItem('juniorswipe_token')).toBe('jwt-1');
    const body = JSON.parse(api.mock.calls[0][1].body);
    expect(body).toEqual({ email: 'dev@local.test', password: 'Password123!' });
  });

  it('permite ver y ocultar la contraseña', async () => {
    renderAuth(<Login />, '/login');
    const input = screen.getByLabelText(/^Contraseña/);
    expect(input).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(input).toHaveAttribute('type', 'text');
  });
});

describe('Registro', () => {
  it('detecta contraseñas distintas y términos sin aceptar', async () => {
    renderAuth(<Register />, '/register');
    await userEvent.type(screen.getByLabelText(/Nombre completo/), 'Laura Gómez');
    await userEvent.type(screen.getByLabelText(/Correo/), 'laura@correo.com');
    await userEvent.type(screen.getByLabelText(/^Contraseña/), 'Segura2026');
    await userEvent.type(screen.getByLabelText(/Confirmar contraseña/), 'Otra2026');
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    expect(screen.getByText(/Debes aceptar los términos/)).toBeInTheDocument();
  });

  it('cambia el formulario cuando se elige cuenta de empresa', async () => {
    renderAuth(<Register />, '/register');
    await userEvent.click(screen.getByLabelText(/Empresa/));
    expect(screen.getByLabelText(/Nombre de la empresa/)).toBeInTheDocument();
  });

  const fillValid = async () => {
    await userEvent.type(screen.getByLabelText(/Nombre completo/), 'Laura Gómez');
    await userEvent.type(screen.getByLabelText(/Correo/), 'laura@correo.com');
    await userEvent.type(screen.getByLabelText(/^Contraseña/), 'Segura2026');
    await userEvent.type(screen.getByLabelText(/Confirmar contraseña/), 'Segura2026');
    await userEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
  };

  it('muestra el correo repetido bajo su campo', async () => {
    mockApi({
      'POST /api/auth/register': () =>
        json({ error: { code: 'email_taken', message: 'Ese correo ya está registrado' } }, 409),
    });
    renderAuth(<Register />, '/register');
    await fillValid();
    expect(await screen.findByText(/Ya existe una cuenta con ese correo/)).toBeInTheDocument();
  });

  it('envía los datos a la API y entra al panel', async () => {
    const api = mockApi({
      'POST /api/auth/register': () => json({ token: 'jwt-2', user: DEV_USER }, 201),
      'GET /api/auth/me': () => DEV_USER,
    });
    renderAuth(<Register />, '/register');
    await fillValid();
    expect(await screen.findByText('Panel cargado')).toBeInTheDocument();
    const body = JSON.parse(api.mock.calls[0][1].body);
    expect(body).toEqual({ full_name: 'Laura Gómez', email: 'laura@correo.com', password: 'Segura2026', role: 'developer' });
    await waitFor(() => expect(localStorage.getItem('juniorswipe_token')).toBe('jwt-2'));
  });
});

describe('Formulario de proyecto', () => {
  it('no envía sin título', async () => {
    const onSubmit = vi.fn();
    render(<ProjectForm onSubmit={onSubmit} />);
    await userEvent.click(screen.getByRole('button', { name: 'Guardar proyecto' }));
    expect(screen.getByText('Ponle un título a tu proyecto')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envía los datos con el formato de la API', async () => {
    const onSubmit = vi.fn();
    render(<ProjectForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText(/Título/), 'Rebranding de cafetería');
    await userEvent.selectOptions(screen.getByLabelText('Estado'), 'active');
    const tools = screen.getByLabelText(/Herramientas/);
    await userEvent.type(tools, 'Figma{enter}Illustrator,figma,');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar proyecto' }));
    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Rebranding de cafetería',
      description: '',
      status: 'active',
      tech_stack: 'Figma, Illustrator',
    });
  });
});

describe('Carga de CV', () => {
  it('rechaza archivos con formato no permitido', async () => {
    const onSubmit = vi.fn();
    const { container } = render(<ResumeUploadForm onSubmit={onSubmit} />);
    const input = container.querySelector('input[type="file"]');
    const file = new File(['x'], 'foto.png', { type: 'image/png' });
    await userEvent.upload(input, file, { applyAccept: false });
    expect(screen.getByText(/Formato no permitido/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Subir CV' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('propone el nombre del archivo como título y envía un FormData', async () => {
    const onSubmit = vi.fn(() => true);
    const { container } = render(<ResumeUploadForm onSubmit={onSubmit} />);
    const file = new File(['%PDF'], 'CV Laura 2026.pdf', { type: 'application/pdf' });
    await userEvent.upload(container.querySelector('input[type="file"]'), file);
    expect(screen.getByLabelText(/Nombre del CV/)).toHaveValue('CV Laura 2026');
    await userEvent.click(screen.getByRole('button', { name: 'Subir CV' }));
    const sent = onSubmit.mock.calls[0][0];
    expect(sent).toBeInstanceOf(FormData);
    expect(sent.get('title')).toBe('CV Laura 2026');
    expect(sent.get('file').name).toBe('CV Laura 2026.pdf');
  });
});
