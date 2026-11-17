import { describe, expect, it, vi } from 'vitest';
import { ApiError, http, toQuery, tokenStore, UNAUTHORIZED_EVENT } from '../src/services/http';
import { projectService } from '../src/services';
import { errorMessage } from '../src/utils/apiErrors';

const respond = (body, status = 200) => vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe('cliente HTTP', () => {
  it('agrega el token Bearer guardado', async () => {
    tokenStore.set('abc123');
    const fetchMock = respond({ items: [] });
    vi.stubGlobal('fetch', fetchMock);
    await projectService.list();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer abc123');
  });

  it('envía los filtros como parámetros y omite los vacíos', async () => {
    const fetchMock = respond({ items: [] });
    vi.stubGlobal('fetch', fetchMock);
    await projectService.list({ q: 'cafe', status: '', page: 2 });
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/api\/projects\?q=cafe&page=2$/);
    expect(toQuery({ a: '', b: null })).toBe('');
  });

  it('convierte la respuesta de error en un ApiError con código', async () => {
    vi.stubGlobal('fetch', respond({ error: { code: 'email_taken', message: 'repetido' } }, 409));
    await expect(http.post('/api/auth/register', {}, { auth: false })).rejects.toMatchObject({
      status: 409,
      code: 'email_taken',
    });
  });

  it('con un 401 borra el token y avisa a la aplicación', async () => {
    tokenStore.set('vencido');
    const handler = vi.fn();
    window.addEventListener(UNAUTHORIZED_EVENT, handler);
    vi.stubGlobal('fetch', respond({ error: { code: 'token_expired', message: 'x' } }, 401));
    await expect(http.get('/api/projects')).rejects.toBeInstanceOf(ApiError);
    expect(tokenStore.get()).toBeNull();
    expect(handler).toHaveBeenCalled();
    window.removeEventListener(UNAUTHORIZED_EVENT, handler);
  });

  it('si la API está apagada lanza network_error con mensaje claro', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const err = await http.get('/api/health').catch((e) => e);
    expect(err.code).toBe('network_error');
    expect(errorMessage(err)).toMatch(/No pudimos conectar con el servidor/);
  });
});
