import { initials } from '../../utils/format';

// Componentes pequeños de estado y retroalimentación que se usan en todas las vistas.

export function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Loader({ label = 'Cargando…' }) {
  return (
    <div className="loader" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function StatCard({ label, value, hint, icon }) {
  return (
    <div className="stat-card">
      {icon && (
        <span className="stat-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
        {hint && <p className="stat-hint">{hint}</p>}
      </div>
    </div>
  );
}

export function Alert({ type = 'error', title, children, action }) {
  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <div>
        {title && <strong>{title}</strong>}
        {children && <p>{children}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon = '✦', title, children, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function ProgressBar({ value = 0, label }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="progress">
      {label && (
        <div className="progress-label">
          <span>{label}</span>
          <strong>{pct}%</strong>
        </div>
      )}
      <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Avatar({ name = '', size = 'md' }) {
  const letters = initials(name);
  return (
    <span className={`avatar avatar-${size}`} aria-hidden="true">
      {letters || '?'}
    </span>
  );
}
