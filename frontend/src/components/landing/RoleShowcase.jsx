import { useState } from 'react';
import candidatoPerfil from '../../assets/images/showcase/candidato-perfil.webp';
import candidatoMatches from '../../assets/images/showcase/candidato-matches.webp';
import candidatoRuta from '../../assets/images/showcase/candidato-ruta.webp';
import empresaVacante from '../../assets/images/showcase/empresa-vacante.webp';
import empresaCandidatos from '../../assets/images/showcase/empresa-candidatos.webp';
import empresaEvidencias from '../../assets/images/showcase/empresa-evidencias.webp';

const ROLES = {
  candidato: {
    label: 'Talento junior',
    items: [
      {
        img: candidatoPerfil,
        alt: 'Editor de perfil con evidencias, habilidades y progreso del perfil',
        title: 'Tu perfil de evidencias',
        text: 'Suma tus proyectos académicos, prácticas y voluntariados. Demuestra lo que sabes hacer, no solo lo que estudiaste.',
      },
      {
        img: candidatoMatches,
        alt: 'Ofertas compatibles ordenadas por porcentaje de match',
        title: 'Tus matches',
        text: 'Recibe ofertas compatibles con tu perfil y postúlate en un clic.',
      },
      {
        img: candidatoRuta,
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
        img: empresaVacante,
        alt: 'Formulario para publicar una vacante con las habilidades requeridas',
        title: 'Publica tu vacante',
        text: 'Define el puesto y las habilidades que buscas en minutos.',
      },
      {
        img: empresaCandidatos,
        alt: 'Lista de candidatos ordenada por match con filtros',
        title: 'Candidatos prefiltrados',
        text: 'Recibe candidatos ordenados por compatibilidad y filtra por carrera, ciudad o habilidades.',
      },
      {
        img: empresaEvidencias,
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
                <img src={item.img} alt={item.alt} loading="lazy" />
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