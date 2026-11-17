import { Link } from 'react-router-dom';
import { PROJECT_STATUSES } from '../../models/constants';
import { formatDate, pluralize } from '../../utils/format';
import { Badge } from '../ui/Feedback';

// Tarjeta de un proyecto en la lista, con acciones de editar y eliminar.
export default function ProjectCard({ project, onEdit, onDelete }) {
  const status = PROJECT_STATUSES[project.status] || { label: project.status, tone: 'neutral' };
  const tools = (project.tech_stack || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <article className="card project-card">
      <div className="project-card-head">
        <Badge tone={status.tone}>{status.label}</Badge>
        <span className="muted">{formatDate(project.created_at)}</span>
      </div>
      <h3>
        <Link to={`/app/proyectos/${project.id}`}>{project.title}</Link>
      </h3>
      {project.description && <p className="project-card-desc">{project.description}</p>}
      {tools.length > 0 && (
        <ul className="tag-list" aria-label="Herramientas">
          {tools.slice(0, 4).map((t) => (
            <li key={t} className="tag tag-static">
              {t}
            </li>
          ))}
          {tools.length > 4 && <li className="tag tag-static">+{tools.length - 4}</li>}
        </ul>
      )}
      <div className="project-card-foot">
        <span className="muted">{pluralize(project.task_count, 'actividad', 'actividades')}</span>
        <div className="project-card-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(project)}>
            Editar
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-danger-text"
            onClick={() => onDelete(project)}
            aria-label={`Eliminar ${project.title}`}
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  );
}
