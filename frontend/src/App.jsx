import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { ProtectedRoute, PublicOnlyRoute } from './components/layout/RouteGuards';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Dashboard from './pages/app/Dashboard';
import Profile from './pages/app/Profile';
import ProjectDetail from './pages/app/ProjectDetail';
import Projects from './pages/app/Projects';
import Resumes from './pages/app/Resumes';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
            <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

            {/* Área interna: exige sesión iniciada. */}
            <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="proyectos" element={<Projects />} />
              <Route path="proyectos/:id" element={<ProjectDetail />} />
              <Route path="perfil" element={<Profile />} />
              <Route path="cv" element={<ProtectedRoute roles={['developer']}><Resumes /></ProtectedRoute>} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
