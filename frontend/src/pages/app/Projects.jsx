import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import ProjectFilters from '../../components/projects/ProjectFilters';
import ProjectForm from '../../components/projects/ProjectForm';
import Button from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/Feedback';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { PENDING_API_MESSAGE } from '../../models/constants';

export default function Projects() {
  useDocumentTitle('Proyectos');
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const creating = params.get('nuevo') === '1';
  const filtering = Boolean(search.trim() || status);

  const openForm = () => setParams({ nuevo: '1' });
  const closeForm = () => setParams({});

  const handleCreate = () => {
    // Guardar el proyecto en la API se conecta en la etapa de integración.
    toast.info(PENDING_API_MESSAGE);
    closeForm();
  };

  return (
    <>
      <PageHeader
        title="Mis proyectos"
        subtitle="Tus evidencias: proyectos académicos, prácticas, voluntariados o proyectos personales."
        actions={<Button onClick={openForm}>+ Nuevo proyecto</Button>}
      />

      <ProjectFilters search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} />

      {filtering ? (
        <EmptyState icon="⌕" title="No hay proyectos que coincidan">
          Prueba con otro título o quita el filtro de estado.
        </EmptyState>
      ) : (
        <EmptyState
          icon="◧"
          title="Aún no tienes proyectos"
          action={<Button onClick={openForm}>Registrar mi primer proyecto</Button>}
        >
          Cada proyecto que registres es una evidencia de lo que sabes hacer.
        </EmptyState>
      )}

      <Modal open={creating} title="Nuevo proyecto" onClose={closeForm}>
        <ProjectForm onSubmit={handleCreate} onCancel={closeForm} />
      </Modal>
    </>
  );
}
