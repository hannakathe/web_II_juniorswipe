import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrolled } from '../../hooks/useLandingEffects';
import SectionLink from './SectionLink';
import logo from '../../assets/brand/juniorswipe-logo-transparente-color.png';


const LINKS = [
  ['inicio', 'Inicio'],
  ['caracteristicas', 'Características'],
  ['como-funciona', 'Cómo Funciona'],
];

export default function LandingNav() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}`}>
      <div className="nav-container">
        <SectionLink to="inicio" className="logo" onNavigate={close}>
          <img src={logo} alt="JuniorSwipe" />
        </SectionLink>

        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>

        <div className="nav-menu" id="nav-menu">
          <ul className="nav-links">
            {LINKS.map(([id, label]) => (
              <li key={id}>
                <SectionLink to={id} className="nav-link" onNavigate={close}>{label}</SectionLink>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <Link to="/login" className="btn btn-ghost">Acceder</Link>
            <Link to="/register" className="btn btn-primary">Registrarse</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}