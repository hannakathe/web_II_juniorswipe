/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services';
import { tokenStore, UNAUTHORIZED_EVENT } from '../services/http';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.getUser());
  const [loading, setLoading] = useState(() => Boolean(tokenStore.get()));
  // true cuando la persona cerró sesión a propósito (no por token vencido).
  const [loggedOut, setLoggedOut] = useState(false);

  // Valida el token guardado contra la API y trae el usuario con su perfil.
  const refresh = useCallback(async () => {
    if (!tokenStore.get()) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const me = await authService.me();
      tokenStore.setUser(me);
      setUser(me);
      return me;
    } catch (err) {
      // Si la API está apagada no cerramos la sesión; solo si el token es inválido.
      if (err.status === 401) {
        tokenStore.clear();
        setUser(null);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const onUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, [refresh]);

  const startSession = useCallback(
    async ({ token, user: u }) => {
      tokenStore.set(token);
      tokenStore.setUser(u);
      setUser(u);
      setLoggedOut(false);
      await refresh();
      return u;
    },
    [refresh],
  );

  const login = useCallback(
    async (email, password) => startSession(await authService.login({ email, password })),
    [startSession],
  );

  const register = useCallback(
    async (payload) => startSession(await authService.register(payload)),
    [startSession],
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setLoggedOut(true);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, loggedOut, login, register, logout, refresh }),
    [user, loading, loggedOut, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
