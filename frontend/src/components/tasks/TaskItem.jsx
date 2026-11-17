import { NEXT_TASK_STATUS, TASK_PRIORITIES, TASK_STATUSES } from '../../models/constants';
import { formatDate } from '../../utils/format';
import { Badge } from '../ui/Feedback';

// Fila de una actividad. Clic en el estado lo avanza: por hacer → en progreso → hecha.
export default function TaskItem({ task, onAdvance, onDelete, busy = false }) {
  const status = TASK_STATUSES[task.status] || TASK_STATUSES.todo;
  const priority = TASK_PRIORITIES[task.priority];
  const next = TASK_STATUSES[NEXT_TASK_STATUS[task.status]];
  const overdue = task.due_date && task.status !== 'done' && new Date(`${task.due_date}T23:59:59`) < new Date();

  return (
    <li className={`task-item task-${task.status}`}>
      <button
        type="button"
        className={`task-status badge badge-${status.tone}`}
        onClick={() => onAdvance(task)}
        disabled={busy}
        title={`Cambiar a “${next?.label}”`}
        aria-label={`${task.title}: ${status.label}. Cambiar a ${next?.label}`}
      >
        {status.label}
      </button>
      <span className="task-title">{task.title}</span>
      <span className="task-meta">
        {priority && <Badge tone={priority.tone}>{priority.label}</Badge>}
        {task.due_date && (
          <span className={overdue ? 'task-overdue' : 'muted'}>
            {overdue ? 'Venció el ' : 'Para el '}
            {formatDate(task.due_date, { day: 'numeric', month: 'short' })}
          </span>
        )}
      </span>
      <button
        type="button"
        className="icon-button"
        onClick={() => onDelete(task)}
        disabled={busy}
        aria-label={`Eliminar actividad ${task.title}`}
      >
        ×
      </button>
    </li>
  );
}
