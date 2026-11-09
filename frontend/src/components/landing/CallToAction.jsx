import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section className="cta" id="cta">
      <div className="container">
        <h2>¿Listo para encontrar tu próximo trabajo?</h2>
        <p>Únete al talento junior que ya confía en JuniorSwipe</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-inverse">Registrarse</Link>
          <Link to="/login" className="btn btn-outline-light">Acceder</Link>
        </div>
      </div>
    </section>
  );
}