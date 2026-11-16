import { Link } from 'react-router-dom';
import logo from '../assets/brand/juniorswipe-logo-transparente-color.png';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Página no encontrada');

  return (
    <main className="not-found">
      <img src={logo} alt="JuniorSwipe" className="not-found-logo" />
      <p className="not-found-code">404</p>
      <h1>No encontramos esta página</h1>
      <p className="muted">Puede que el enlace esté mal escrito o que la página ya no exista.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </main>
  );
}
