import { describe, expect, it } from 'vitest';
import {
  email,
  fileSize,
  fileType,
  matches,
  maxLength,
  minLength,
  notPastDate,
  password,
  passwordStrength,
  required,
  url,
  validate,
} from '../src/utils/validators';
import { formatBytes } from '../src/utils/format';
import { profileCompleteness } from '../src/utils/profile';

describe('reglas de validación', () => {
  it('required rechaza vacíos y espacios', () => {
    expect(required()('')).toBeTruthy();
    expect(required()('   ')).toBeTruthy();
    expect(required()('hola')).toBeNull();
  });

  it('minLength y maxLength ignoran el campo vacío', () => {
    expect(minLength(3)('')).toBeNull();
    expect(minLength(3)('ab')).toMatch(/3/);
    expect(maxLength(5)('123456')).toMatch(/5/);
    expect(maxLength(5)('12345')).toBeNull();
  });

  it('email valida el formato', () => {
    expect(email()('laura@correo.com')).toBeNull();
    expect(email()('laura@correo')).toBeTruthy();
    expect(email()('sin-arroba.com')).toBeTruthy();
  });

  it('url exige http o https', () => {
    expect(url()('https://behance.net/laura')).toBeNull();
    expect(url()('behance.net/laura')).toBeTruthy();
  });

  it('password exige 8 caracteres con letras y números', () => {
    expect(password()('corta1')).toMatch(/8/);
    expect(password()('solamenteletras')).toMatch(/letras y números/);
    expect(password()('Segura2026')).toBeNull();
  });

  it('matches compara con otro campo', () => {
    const rule = matches('password');
    expect(rule('abc12345', { password: 'abc12345' })).toBeNull();
    expect(rule('otra1234', { password: 'abc12345' })).toBeTruthy();
  });

  it('notPastDate rechaza fechas anteriores a hoy', () => {
    expect(notPastDate()('2000-01-01')).toBeTruthy();
    const future = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
    expect(notPastDate()(future)).toBeNull();
  });

  it('fileType y fileSize validan archivos', () => {
    const pdf = { name: 'cv.PDF', size: 1000 };
    const exe = { name: 'virus.exe', size: 10 };
    expect(fileType(['.pdf'])(pdf)).toBeNull();
    expect(fileType(['.pdf'])(exe)).toMatch(/Formato/);
    expect(fileSize(500)(pdf)).toBeTruthy();
    expect(fileSize(5000)(pdf)).toBeNull();
  });

  it('validate devuelve el primer error de cada campo', () => {
    const errors = validate(
      { name: '', mail: 'malo' },
      { name: [required('Falta el nombre')], mail: [required(), email('Correo inválido')] },
    );
    expect(errors).toEqual({ name: 'Falta el nombre', mail: 'Correo inválido' });
  });

  it('passwordStrength sube con longitud y variedad', () => {
    expect(passwordStrength('')).toBe(0);
    expect(passwordStrength('abcdefgh')).toBe(1);
    expect(passwordStrength('Abcdefgh12!xyz')).toBe(4);
  });
});

describe('utilidades', () => {
  it('formatBytes muestra unidades legibles', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB');
  });

  it('profileCompleteness calcula el porcentaje diligenciado', () => {
    const empty = { full_name: '', headline: '', bio: '', location: '', website: '', skills: [] };
    expect(profileCompleteness(empty)).toBe(0);
    expect(profileCompleteness({ ...empty, full_name: 'Laura', skills: ['Figma'] })).toBe(33);
  });
});
