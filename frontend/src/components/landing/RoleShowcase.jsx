import { useState } from 'react';

// capturas opcionales: si el archivo existe en assets/images/showcase/ se muestra,
// si no, se renderiza un placeholder (así el build no falla mientras no existan)
const SHOTS = import.meta.glob('../../assets/images/showcase/*.{webp,png,jpg}', {
  eager: true,
  import: 'default',
});

const shot = (name) => {
  const key = Object.keys(SHOTS).find((k) => k.split('/').pop().split('.')[0] === name);
  return key ? SHOTS[key] : null;
};

const ROLES = {
  candidato: {
    label: 'Talento junior',
    items: [
      {
        img: shot('candidato-perfil'),
        alt: 'Editor de perfil con evidencias, habilidades y progreso del perfil',
        title: 'Tu perfil de evidencias',
        text: 'Suma tus proyectos académicos, prácticas y voluntariados. Demuestra lo que sabes hacer, no solo lo que estudiaste.',
      },
      {
        img: shot('candidato-matches'),
        alt: 'Ofertas compatibles ordenadas por porcentaje de match',
        title: 'Tus matches',
        text: 'Recibe ofertas compatibles con tu perfil y postúlate en un clic.',
      },
      {
        img: shot('candidato-ruta'),
        alt: 'Análisis de brechas con un proyecto sugerido',
        title: 'Tu ruta de empleabilidad',
        text: 'Descubre qué te falta para cada oferta y qué proyecto te ayuda a conseguirlo.',
      },
    ],
  },
  empresa: {
    label: 'Empresas',
    items: [
      {
        img: shot('empresa-vacante'),
        alt: 'Formulario para publicar una vacante con las habilidades requeridas',
        title: 'Publica tu vacante',
        text: 'Define el puesto y las habilidades que buscas en minutos.',
      },
      {
        img: shot('empresa-candidatos'),
        alt: 'Lista de candidatos ordenada por match con filtros',
        title: 'Candidatos prefiltrados',
        text: 'Recibe candidatos ordenados por compatibilidad y filtra por carrera, ciudad o habilidades.',
      },
      {
        img: shot('empresa-evidencias'),
        alt: 'Detalle de una candidata con sus evidencias verificadas',
        title: 'Evalúa evidencias, no CVs',
        text: 'Revisa los proyectos reales de cada candidato y contáctalo directamente.',
      },
    ],
  },
};

export default function RoleShowcase() {
  const [role, setRole] = useState('candidato');

  return (
    <section className="section showcase" id="para-quien">
      <div className="container">
        <h2 className="section-title">Así funciona para ti</h2>
        <p className="section-subtitle">Una experiencia pensada para cada lado del match</p>

        <div className="showcase-tabs" role="tablist" aria-label="Tipo de usuario">
          {Object.entries(ROLES).map(([key, r]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={role === key}
              className={`showcase-tab${role === key ? ' active' : ''}`}
              onClick={() => setRole(key)}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="showcase-grid">
          {ROLES[role].items.map((item) => (
            <article className="showcase-item" key={item.title}>
              <div className="showcase-image">
                {item.img ? (
                  <img src={item.img} alt={item.alt} loading="lazy" />
                ) : (
                  <span className="showcase-placeholder" role="img" aria-label={item.alt}>
                    {item.title}
                  </span>
                )}
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}