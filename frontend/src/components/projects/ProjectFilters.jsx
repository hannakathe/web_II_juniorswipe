import { PROJECT_STATUSES } from '../../models/constants';

// Buscador por título + filtro por estado. Es controlado: el padre guarda los valores.
export default function ProjectFilters({ search, status, onSearchChange, onStatusChange }) {
  const options = [['', 'Todos'], ...Object.entries(PROJECT_STATUSES).map(([k, v]) => [k, v.label])];

  return (
    <div className="filters">
      <div className="search-box">
        <span aria-hidden="true">⌕</span>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por título…"
          aria-label="Buscar proyectos por título"
        />
      </div>
      <div className="chip-group" role="radiogroup" aria-label="Filtrar por estado">
        {options.map(([value, label]) => (
          <button
            key={value || 'all'}
            type="button"
            role="radio"
            aria-checked={status === value}
            className={`chip${status === value ? ' active' : ''}`}
            onClick={() => onStatusChange(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
