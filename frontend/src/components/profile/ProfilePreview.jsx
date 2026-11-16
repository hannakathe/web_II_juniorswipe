import { profileCompleteness } from '../../utils/profile';
import { Avatar, ProgressBar } from '../ui/Feedback';

// Tarjeta que muestra cómo verá una empresa el perfil, en vivo mientras se edita.
export default function ProfilePreview({ values }) {
  const name = values.full_name.trim() || 'Tu nombre';

  return (
    <aside className="card profile-preview" aria-label="Vista previa del perfil">
      <p className="eyebrow">Así te verán las empresas</p>
      <div className="preview-head">
        <Avatar name={values.full_name || '?'} size="lg" />
        <div>
          <h3>{name}</h3>
          <p className="muted">{values.headline.trim() || 'Tu titular profesional'}</p>
          {values.location.trim() && <p className="preview-meta">📍 {values.location}</p>}
        </div>
      </div>
      {values.bio.trim() && <p className="preview-bio">{values.bio}</p>}
      {values.skills.length > 0 && (
        <ul className="tag-list" aria-label="Habilidades">
          {values.skills.map((s) => (
            <li key={s} className="tag tag-static">
              {s}
            </li>
          ))}
        </ul>
      )}
      {values.website.trim() && (
        <p className="preview-meta">
          🔗 <span className="preview-link">{values.website}</span>
        </p>
      )}
      <ProgressBar value={profileCompleteness(values)} label="Perfil completo" />
    </aside>
  );
}
