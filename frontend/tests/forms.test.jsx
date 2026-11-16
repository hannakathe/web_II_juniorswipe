import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ProjectForm from '../src/components/projects/ProjectForm';
import ResumeUploadForm from '../src/components/resumes/ResumeUploadForm';
import Login from '../src/pages/auth/Login';
import Register from '../src/pages/auth/Register';

const inRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Inicio de sesión', () => {
  it('muestra errores si se envía vacío', async () => {
    inRouter(<Login />);
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(screen.getByText('Escribe tu correo')).toBeInTheDocument();
    expect(screen.getByText('Escribe tu contraseña')).toBeInTheDocument();
  });

  it('valida el formato del correo al salir del campo', async () => {
    inRouter(<Login />);
    const mail = screen.getByLabelText(/Correo/);
    await userEvent.type(mail, 'laura@correo');
    await userEvent.tab();
    expect(screen.getByText(/Escribe un correo válido/)).toBeInTheDocument();
  });

  it('acepta datos válidos', async () => {
    inRouter(<Login />);
    await userEvent.type(screen.getByLabelText(/Correo/), 'laura@correo.com');
    await userEvent.type(screen.getByLabelText(/^Contraseña/), 'Segura2026');
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    expect(screen.getByText('Formulario válido')).toBeInTheDocument();
  });

  it('permite ver y ocultar la contraseña', async () => {
    inRouter(<Login />);
    const input = screen.getByLabelText(/^Contraseña/);
    expect(input).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(input).toHaveAttribute('type', 'text');
  });
});

describe('Registro', () => {
  it('detecta contraseñas distintas y términos sin aceptar', async () => {
    inRouter(<Register />);
    await userEvent.type(screen.getByLabelText(/Nombre completo/), 'Laura Gómez');
    await userEvent.type(screen.getByLabelText(/Correo/), 'laura@correo.com');
    await userEvent.type(screen.getByLabelText(/^Contraseña/), 'Segura2026');
    await userEvent.type(screen.getByLabelText(/Confirmar contraseña/), 'Otra2026');
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));
    expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    expect(screen.getByText(/Debes aceptar los términos/)).toBeInTheDocument();
  });

  it('cambia el formulario cuando se elige cuenta de empresa', async () => {
    inRouter(<Register />);
    await userEvent.click(screen.getByLabelText(/Empresa/));
    expect(screen.getByLabelText(/Nombre de la empresa/)).toBeInTheDocument();
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
