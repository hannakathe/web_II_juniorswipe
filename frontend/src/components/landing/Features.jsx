import iaIcon from '../../assets/icons/ia-icon.png';
import setupIcon from '../../assets/icons/setup-icon.png';
import analisisIcon from '../../assets/icons/analisis-icon.png';
import projectsIcon from '../../assets/icons/projects-icon.png';
import notificationIcon from '../../assets/icons/notification-icon.png';
import companiesIcon from '../../assets/icons/companies-icon.png';

const FEATURES = [
  {
    icon: iaIcon, alt: 'Icono de IA', title: 'Matching con IA',
    text: 'Algoritmo de matching que analiza habilidades, experiencia y compatibilidad cultural para conectarte con las mejores oportunidades.',
  },
  {
    icon: setupIcon, alt: 'Icono de Setup', title: 'Setup en Minutos',
    text: 'Sube tu CV y nuestra IA extrae automáticamente tus skills, experiencia y proyectos. Sin formularios largos.',
  },
  {
    icon: analisisIcon, alt: 'Icono de Analisis', title: 'Análisis de Brechas',
    text: 'Identificamos gaps en tu perfil y te sugerimos proyectos específicos para mejorar tu empleabilidad.',
  },
  {
    icon: projectsIcon, alt: 'Icono de Proyectos', title: 'Proyectos Personalizados',
    text: 'Generamos rutas de aprendizaje con proyectos prácticos adaptados a las habilidades que necesitas desarrollar.',
  },
  {
    icon: notificationIcon, alt: 'Icono de Notificaciones', title: 'Notificaciones Inteligentes',
    text: 'Recibe alertas solo de matches relevantes. Sin spam, solo oportunidades que verdaderamente encajan contigo.',
  },
  {
    icon: companiesIcon, alt: 'Icono de Empresas', title: 'Para Empresas',
    text: 'Encuentra candidatos prefiltrados con match scores precisos. Ahorra tiempo en reclutamiento.',
  },
];

export default function Features() {
  return (
    <section className="section features" id="caracteristicas">
      <div className="container">
        <h2 className="section-title">¿Por qué JuniorSwipe?</h2>
        <p className="section-subtitle">
          Automatización inteligente que reduce la fricción entre talento y oportunidad
        </p>

        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">
                <img src={f.icon} alt={f.alt} className="feature-icon-image" loading="lazy" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}