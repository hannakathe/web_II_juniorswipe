import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../ui/Feedback';
import { EmptyState } from '../ui/Feedback';
import { ROLES } from '../../models/constants';

// Exige sesión. Con `roles`, además exige uno de esos tipos de cuenta.
export function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader label="Verificando tu sesión…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  if (roles && !roles.includes(user.role)) {
    const allowed = roles.map((r) => ROLES[r]?.label || r).join(' o ');
    return (
      <EmptyState icon="⛔" title="Esta sección no está disponible para tu cuenta">
        Solo las cuentas de {allowed} pueden entrar aquí.
      </EmptyState>
    );
  }
  return children;
}

// Para inicio de sesión y registro: si ya hay sesión, lleva al panel.
export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loader label="Verificando tu sesión…" />;
  if (user) return <Navigate to="/app" replace />;
  return children;
}
