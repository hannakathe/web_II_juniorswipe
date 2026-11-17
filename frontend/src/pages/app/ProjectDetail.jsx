import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProjectForm from '../../components/projects/ProjectForm';
import TaskForm from '../../components/tasks/TaskForm';
import TaskItem from '../../components/tasks/TaskItem';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Badge, EmptyState, Loader, ProgressBar } from '../../components/ui/Feedback';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { NEXT_TASK_STATUS, PROJECT_STATUSES, TASK_STATUSES } from '../../models/constants';
import { projectService, taskService } from '../../services';
import { errorMessage } from '../../utils/apiErrors';
import { formatDate } from '../../utils/format';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(null); // { type: 'project' } | { type: 'task', task }
  useDocumentTitle(project?.title || 'Proyecto');

  const load = useCallback(async () => {
    try {
      setProject(await projectService.get(id));
      setError(null);
    } catch (err) {
      setError(err);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // Ejecuta una acción contra la API y recarga el proyecto.
  const run = async (action, successMsg) => {
    setBusy(true);
    try {
      await action();
      if (successMsg) toast.success(successMsg);
      await load();
      return true;
    } catch (err) {
      toast.error(errorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <EmptyState
        icon="⌕"
        title={error.status === 404 ? 'No encontramos este proyecto' : 'No pudimos cargar el proyecto'}
        action={
          <Link to="/app/proyectos" className="btn btn-primary">
            Volver a mis proyectos
          </Link>
        }
      >
        {error.status === 404 ? 'Puede que se haya eliminado o que pertenezca a otra cuenta.' : errorMessage(error)}
      </EmptyState>
    );
  }
  if (!project) return <Loader label="Cargando proyecto…" />;

  const status = PROJECT_STATUSES[project.status];
  const tasks = project.tasks || [];
  const done = tasks.filter((t) => t.status === 'done').length;
  const visible = filter ? tasks.filter((t) => t.status === filter) : tasks;
  const tools = (project.tech_stack || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const handleConfirm = async () => {
    if (confirm.type === 'project') {
      // Sin recargar: el proyecto ya no existe, se vuelve a la lista.
      setBusy(true);
      try {
        await projectService.remove(project.id);
        toast.success('Proyecto eliminado.');
        navigate('/app/proyectos', { replace: true });
        return;
      } catch (err) {
        toast.error(errorMessage(err));
        setBusy(false);
      }
    } else {
      await run(() => taskService.remove(confirm.task.id), 'Actividad eliminada.');
    }
    setConfirm(null);
  };

  return (
    <>
      <Link to="/app/proyectos" className="back-link">
        ← Mis proyectos
      </Link>

      <section className="card project-detail">
        <div className="project-detail-head">
          <div>
            <Badge tone={status?.tone}>{status?.label}</Badge>
            <h1>{project.title}</h1>
            <p className="muted">Creado el {formatDate(project.created_at)}</p>
          </div>
          <div className="page-actions">
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              Editar
            </Button>
            <Button variant="ghost" size="sm" className="btn-danger-text" onClick={() => setConfirm({ type: 'project' })}>
              Eliminar
            </Button>
          </div>
        </div>
        {project.description && <p className="project-detail-desc">{project.description}</p>}
        {tools.length > 0 && (
          <ul className="tag-list" aria-label="Herramientas">
            {tools.map((t) => (
              <li key={t} className="tag tag-static">
                {t}
              </li>
            ))}
          </ul>
        )}
        <ProgressBar value={tasks.length ? (done / tasks.length) * 100 : 0} label={`${done} de ${tasks.length} actividades hechas`} />
      </section>

      <section className="card" aria-labelledby="tasks-title">
        <div className="card-head">
          <h2 id="tasks-title" className="card-title">
            Actividades
          </h2>
          <div className="chip-group" role="radiogroup" aria-label="Filtrar actividades por estado">
            {[['', 'Todas'], ...Object.entries(TASK_STATUSES).map(([k, v]) => [k, v.label])].map(([value, label]) => (
              <button
                key={value || 'all'}
                type="button"
                role="radio"
                aria-checked={filter === value}
                className={`chip chip-sm${filter === value ? ' active' : ''}`}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <TaskForm
          submitting={busy}
          onSubmit={(payload) => run(() => taskService.create({ ...payload, project_id: project.id }), 'Actividad agregada.')}
        />

        {visible.length === 0 ? (
          <p className="muted empty-inline">
            {tasks.length === 0 ? 'Este proyecto aún no tiene actividades.' : 'No hay actividades con ese estado.'}
          </p>
        ) : (
          <ul className="task-list">
            {visible.map((t) => (
              <TaskItem
                key={t.id}
                task={t}
                busy={busy}
                onAdvance={(task) => run(() => taskService.update(task.id, { status: NEXT_TASK_STATUS[task.status] }))}
                onDelete={(task) => setConfirm({ type: 'task', task })}
              />
            ))}
          </ul>
        )}
      </section>

      <Modal open={editing} title="Editar proyecto" onClose={() => setEditing(false)}>
        <ProjectForm
          initialValues={project}
          submitting={busy}
          submitLabel="Guardar cambios"
          onCancel={() => setEditing(false)}
          onSubmit={async (payload) => {
            if (await run(() => projectService.update(project.id, payload), 'Proyecto actualizado.')) setEditing(false);
          }}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.type === 'project' ? 'Eliminar proyecto' : 'Eliminar actividad'}
        message={
          confirm?.type === 'project'
            ? `Se eliminará “${project.title}” con todas sus actividades. Esta acción no se puede deshacer.`
            : `Se eliminará la actividad “${confirm?.task?.title}”.`
        }
        loading={busy}
        onConfirm={handleConfirm}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}
