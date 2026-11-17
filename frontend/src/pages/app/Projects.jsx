import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectFilters from '../../components/projects/ProjectFilters';
import ProjectForm from '../../components/projects/ProjectForm';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Alert, EmptyState, Loader } from '../../components/ui/Feedback';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { useToast } from '../../context/ToastContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { PROJECTS_PER_PAGE } from '../../models/constants';
import { projectService } from '../../services';
import { errorMessage } from '../../utils/apiErrors';

export default function Projects() {
  useDocumentTitle('Proyectos');
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const query = useDebounce(search.trim());
  const creating = params.get('nuevo') === '1';
  const filtering = Boolean(query || status);

  const load = useCallback(async () => {
    setError(null);
    try {
      setResult(await projectService.list({ q: query, status, page, per_page: PROJECTS_PER_PAGE }));
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [query, status, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // Al cambiar búsqueda o filtro se vuelve a la primera página.
  const changeSearch = (v) => {
    setSearch(v);
    setPage(1);
  };
  const changeStatus = (v) => {
    setStatus(v);
    setPage(1);
  };

  const closeForm = () => {
    setEditing(null);
    if (creating) setParams({});
  };

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (editing) {
        await projectService.update(editing.id, payload);
        toast.success('Proyecto actualizado.');
      } else {
        await projectService.create(payload);
        toast.success('Proyecto creado.');
      }
      closeForm();
      load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await projectService.remove(deleting.id);
      toast.success('Proyecto eliminado.');
      setDeleting(null);
      // Si se borró el último de la página, se retrocede una.
      if (result.items.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  let content;
  if (error) {
    content = (
      <Alert type="error" action={<Button variant="ghost" size="sm" onClick={load}>Reintentar</Button>}>
        {error}
      </Alert>
    );
  } else if (!result) {
    content = <Loader label="Cargando proyectos…" />;
  } else if (result.items.length === 0) {
    content = filtering ? (
      <EmptyState icon="⌕" title="No hay proyectos que coincidan">
        Prueba con otro título o quita el filtro de estado.
      </EmptyState>
    ) : (
      <EmptyState
        icon="◧"
        title="Aún no tienes proyectos"
        action={<Button onClick={() => setParams({ nuevo: '1' })}>Registrar mi primer proyecto</Button>}
      >
        Cada proyecto que registres es una evidencia de lo que sabes hacer.
      </EmptyState>
    );
  } else {
    content = (
      <>
        <p className="muted results-count">
          {result.total} {result.total === 1 ? 'proyecto' : 'proyectos'}
        </p>
        <div className="projects-grid">
          {result.items.map((p) => (
            <ProjectCard key={p.id} project={p} onEdit={setEditing} onDelete={setDeleting} />
          ))}
        </div>
        <Pagination page={result.page} perPage={result.per_page} total={result.total} onChange={setPage} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Mis proyectos"
        subtitle="Tus evidencias: proyectos académicos, prácticas, voluntariados o proyectos personales."
        actions={<Button onClick={() => setParams({ nuevo: '1' })}>+ Nuevo proyecto</Button>}
      />

      <ProjectFilters search={search} status={status} onSearchChange={changeSearch} onStatusChange={changeStatus} />

      {content}

      <Modal open={creating || Boolean(editing)} title={editing ? 'Editar proyecto' : 'Nuevo proyecto'} onClose={closeForm}>
        <ProjectForm
          key={editing?.id || 'nuevo'}
          initialValues={editing}
          submitting={saving}
          submitLabel={editing ? 'Guardar cambios' : 'Crear proyecto'}
          onSubmit={handleSave}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar proyecto"
        message={deleting ? `Se eliminará “${deleting.title}” con todas sus actividades. Esta acción no se puede deshacer.` : ''}
        loading={saving}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
