import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import ResumeItem from '../../components/resumes/ResumeItem';
import ResumeUploadForm from '../../components/resumes/ResumeUploadForm';
import Button from '../../components/ui/Button';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Alert, EmptyState, Loader } from '../../components/ui/Feedback';
import { useToast } from '../../context/ToastContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { resumeService } from '../../services';
import { errorMessage } from '../../utils/apiErrors';

export default function Resumes() {
  useDocumentTitle('Mis CV');
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems((await resumeService.list()).items);
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

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

  const download = async (resume) => {
    try {
      const res = await resumeService.download(resume.id);
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement('a');
      a.href = url;
      a.download = resume.original_filename || 'cv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  let list;
  if (error) {
    list = (
      <Alert type="error" action={<Button variant="ghost" size="sm" onClick={load}>Reintentar</Button>}>
        {error}
      </Alert>
    );
  } else if (!items) {
    list = <Loader label="Cargando tus CV…" />;
  } else if (items.length === 0) {
    list = (
      <EmptyState icon="▤" title="Todavía no has subido tu CV">
        Cuando subas uno aparecerá aquí, con la opción de descargarlo o marcarlo como principal.
      </EmptyState>
    );
  } else {
    list = (
      <ul className="resume-list">
        {items.map((r) => (
          <ResumeItem
            key={r.id}
            resume={r}
            busy={busy}
            onDownload={download}
            onMakePrimary={(res) => run(() => resumeService.update(res.id, { is_primary: true }), 'CV principal actualizado.')}
            onDelete={setDeleting}
          />
        ))}
      </ul>
    );
  }

  return (
    <>
      <PageHeader title="Mis CV" subtitle="Guarda varias versiones de tu hoja de vida y elige la principal." />
      <div className="split-layout">
        <ResumeUploadForm submitting={busy} onSubmit={(fd) => run(() => resumeService.create(fd), 'CV subido.')} />
        <section className="card" aria-labelledby="cv-list-title">
          <h2 id="cv-list-title" className="card-title">
            CV guardados
          </h2>
          {list}
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar CV"
        message={deleting ? `Se eliminará “${deleting.title}” y su archivo. Esta acción no se puede deshacer.` : ''}
        loading={busy}
        onConfirm={async () => {
          await run(() => resumeService.remove(deleting.id), 'CV eliminado.');
          setDeleting(null);
        }}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
}
