import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import { ToastProvider } from './context/ToastContext';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import Dashboard from './pages/app/Dashboard';
import Profile from './pages/app/Profile';
import Projects from './pages/app/Projects';
import Resumes from './pages/app/Resumes';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Área interna. Cuando exista la API, estas rutas se protegerán con la sesión. */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="proyectos" element={<Projects />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="cv" element={<Resumes />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
