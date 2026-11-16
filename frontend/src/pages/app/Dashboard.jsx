import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const STEPS = [
  {
    to: '/app/perfil',
    icon: '◉',
    title: 'Completa tu perfil',
    text: 'Agrega tu titular, ciudad y habilidades para que las empresas te encuentren.',
    cta: 'Editar perfil',
  },
  {
    to: '/app/proyectos?nuevo=1',
    icon: '◧',
    title: 'Registra una evidencia',
    text: 'Suma un proyecto académico, una práctica o un voluntariado con lo que hiciste.',
    cta: 'Nuevo proyecto',
  },
  {
    to: '/app/cv',
    icon: '▤',
    title: 'Sube tu CV',
    text: 'Ten a mano tu hoja de vida en PDF o Word para postularte en un clic.',
    cta: 'Subir CV',
  },
];

const TIPS = [
  'Describe resultados, no solo tareas: “aumenté las ventas un 15 %” dice más que “hice publicidad”.',
  'Incluye las herramientas que usaste en cada proyecto; así el matching es más preciso.',
  'Un perfil completo recibe más visitas de empresas.',
];

export default function Dashboard() {
  useDocumentTitle('Panel');

  return (
    <>
      <PageHeader title="Hola 👋" subtitle="Empieza a construir tu perfil de evidencias en tres pasos." />

      <section className="steps-grid" aria-label="Primeros pasos">
        {STEPS.map((s, i) => (
          <article className="card step-card" key={s.to}>
            <div className="step-card-head">
              <span className="step-card-icon" aria-hidden="true">
                {s.icon}
              </span>
              <span className="step-card-number">Paso {i + 1}</span>
            </div>
            <h2>{s.title}</h2>
            <p className="muted">{s.text}</p>
            <Link to={s.to} className="btn btn-primary btn-sm">
              {s.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="card tips-card" aria-labelledby="tips-title">
        <h2 id="tips-title" className="card-title">
          Consejos para destacar
        </h2>
        <ul className="tips-list">
          {TIPS.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
