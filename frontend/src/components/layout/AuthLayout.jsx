import { Link } from 'react-router-dom';
import logoWhite from '../../assets/brand/juniorswipe-logo-transparente-blanco.png';
import logo from '../../assets/brand/juniorswipe-logo-transparente-color.png';

const POINTS = [
  'Muestra evidencias reales: proyectos, prácticas y voluntariados.',
  'Recibe ofertas compatibles con tu perfil.',
  'Descubre qué te falta para cada oportunidad.',
];

// Pantalla dividida para inicio de sesión y registro: panel de marca + formulario.
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <aside className="auth-brand">
        <Link to="/" className="auth-brand-logo" aria-label="Volver al inicio">
          <img src={logoWhite} alt="JuniorSwipe" />
        </Link>
        <div>
          <h2>Tu talento vale más que tu experiencia</h2>
          <ul className="auth-points">
            {POINTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <p className="auth-brand-foot">© 2026 JuniorSwipe</p>
      </aside>

      <main className="auth-main">
        <Link to="/" className="auth-mobile-logo" aria-label="Volver al inicio">
          <img src={logo} alt="JuniorSwipe" />
        </Link>
        <div className="auth-card">
          <header>
            <h1>{title}</h1>
            {subtitle && <p className="muted">{subtitle}</p>}
          </header>
          {children}
          {footer && <footer className="auth-footer">{footer}</footer>}
        </div>
        <Link to="/" className="auth-back">
          ← Volver al inicio
        </Link>
      </main>
    </div>
  );
}
