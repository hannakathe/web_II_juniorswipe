import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import logo from '../../assets/brand/juniorswipe-logo-transparente-color.png';
import { Avatar } from '../ui/Feedback';

const APP_LINKS = [
  { to: '/app', label: 'Panel', icon: '▦', end: true },
  { to: '/app/proyectos', label: 'Proyectos', icon: '◧' },
  { to: '/app/perfil', label: 'Mi perfil', icon: '◉' },
  { to: '/app/cv', label: 'Mis CV', icon: '▤' },
];

// Estructura del área interna: barra lateral en escritorio y menú desplegable en móvil.
export default function AppLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [lastPath, setLastPath] = useState(pathname);

  // Cierra el menú móvil al cambiar de página.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <div className={`app-shell${open ? ' menu-open' : ''}`}>
      <a href="#app-content" className="skip-link">
        Saltar al contenido
      </a>

      <aside className="app-sidebar" id="app-sidebar">
        <Link to="/" className="app-logo" aria-label="Ir al inicio">
          <img src={logo} alt="JuniorSwipe" />
        </Link>
        <nav aria-label="Secciones">
          <ul className="app-nav">
            {APP_LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className="app-nav-link">
                  <span className="app-nav-icon" aria-hidden="true">
                    {l.icon}
                  </span>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="app-sidebar-foot">
          <div className="app-user">
            <Avatar name="Mi cuenta" size="sm" />
            <div>
              <strong>Mi cuenta</strong>
              <span>Sesión sin conectar</span>
            </div>
          </div>
          <Link to="/" className="btn btn-ghost btn-sm btn-block">
            Salir
          </Link>
        </div>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <button
            type="button"
            className="menu-toggle app-menu-toggle"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={open}
            aria-controls="app-sidebar"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
          <Link to="/" className="app-topbar-logo">
            <img src={logo} alt="JuniorSwipe" />
          </Link>
        </header>
        <div className="app-overlay" onClick={() => setOpen(false)} aria-hidden="true" />
        <main className="app-content" id="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
