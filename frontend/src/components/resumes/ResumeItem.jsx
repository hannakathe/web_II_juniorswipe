import { formatBytes, formatDate } from '../../utils/format';
import { Badge } from '../ui/Feedback';

// Fila de un CV guardado con sus acciones.
export default function ResumeItem({ resume, busy = false, onDownload, onMakePrimary, onDelete }) {
  return (
    <li className={`resume-item${resume.is_primary ? ' is-primary' : ''}`}>
      <span className="resume-icon" aria-hidden="true">
        ▤
      </span>
      <div className="resume-info">
        <p className="resume-title">
          {resume.title} {resume.is_primary && <Badge tone="brand">Principal</Badge>}
        </p>
        <p className="muted">
          {resume.has_file ? `${resume.original_filename} · ${formatBytes(resume.size_bytes)}` : 'Sin archivo adjunto'}
          {' · '}
          {formatDate(resume.created_at)}
        </p>
        {resume.summary && <p className="resume-summary">{resume.summary}</p>}
      </div>
      <div className="resume-actions">
        {resume.has_file && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onDownload(resume)} disabled={busy}>
            Descargar
          </button>
        )}
        {!resume.is_primary && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onMakePrimary(resume)} disabled={busy}>
            Marcar principal
          </button>
        )}
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-danger-text"
          onClick={() => onDelete(resume)}
          disabled={busy}
          aria-label={`Eliminar ${resume.title}`}
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
