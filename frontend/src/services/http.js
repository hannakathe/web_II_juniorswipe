// Cliente HTTP central para la API de JuniorSwipe:
// - toma la URL base de VITE_API_URL
// - agrega el encabezado Authorization: Bearer <token>
// - convierte la respuesta { error: { code, message } } en un ApiError
// - emite "juniorswipe:unauthorized" cuando la API responde 401

const RAW_BASE = import.meta.env.VITE_API_URL;
export const BASE_URL = (RAW_BASE === undefined ? 'http://localhost:5000' : RAW_BASE).replace(/\/$/, '');

const TOKEN_KEY = 'juniorswipe_token';
const USER_KEY = 'juniorswipe_user';

const safe = (fn, fallback = null) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

export const tokenStore = {
  get: () => safe(() => localStorage.getItem(TOKEN_KEY)),
  set: (t) => safe(() => localStorage.setItem(TOKEN_KEY, t)),
  getUser: () => safe(() => JSON.parse(localStorage.getItem(USER_KEY) || 'null')),
  setUser: (u) => safe(() => localStorage.setItem(USER_KEY, JSON.stringify(u))),
  clear: () =>
    safe(() => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }),
};

export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const UNAUTHORIZED_EVENT = 'juniorswipe:unauthorized';

async function request(method, path, { body, auth = true, raw = false } = {}) {
  const headers = {};
  const opts = { method, headers };

  if (body instanceof FormData) {
    opts.body = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }

  if (auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, opts);
  } catch {
    throw new ApiError(`No se pudo conectar con la API (${BASE_URL || 'mismo origen'})`, 0, 'network_error');
  }

  if (res.status === 401 && auth) {
    tokenStore.clear();
    window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
  }

  if (res.status === 204) return null;

  if (raw) {
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const err = data.error || {};
      throw new ApiError(err.message || `HTTP ${res.status}`, res.status, err.code, err.details);
    }
    return res;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data.error || {};
    throw new ApiError(err.message || `HTTP ${res.status}`, res.status, err.code, err.details);
  }
  return data;
}

export const http = {
  get: (path, opts) => request('GET', path, opts),
  post: (path, body, opts) => request('POST', path, { ...opts, body }),
  put: (path, body, opts) => request('PUT', path, { ...opts, body }),
  patch: (path, body, opts) => request('PATCH', path, { ...opts, body }),
  del: (path, opts) => request('DELETE', path, opts),
  raw: (method, path, opts) => request(method, path, { ...opts, raw: true }),
};

// Convierte { status: 'open', q: '' } en "?status=open", omitiendo vacíos.
export function toQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== '') qs.append(k, v);
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
}
