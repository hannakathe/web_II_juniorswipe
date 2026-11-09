import { Link } from 'react-router-dom';
import SectionLink from './SectionLink';
import logoWhite from '../../assets/brand/juniorswipe-logo-transparente-blanco.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img src={logoWhite} alt="JuniorSwipe" className="footer-logo" />
            <p>Conectando talento junior con oportunidades mediante IA.</p>
          </div>

          <div className="footer-section">
            <h3>Navegación</h3>
            <ul className="footer-links">
              <li><SectionLink to="inicio">Inicio</SectionLink></li>
              <li><SectionLink to="caracteristicas">Características</SectionLink></li>
              <li><SectionLink to="como-funciona">Cómo Funciona</SectionLink></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Plataforma</h3>
            <ul className="footer-links">
              <li><Link to="/register">Registrarse</Link></li>
              <li><Link to="/login">Acceder</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 JuniorSwipe. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}