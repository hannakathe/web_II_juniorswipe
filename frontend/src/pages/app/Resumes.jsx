import PageHeader from '../../components/layout/PageHeader';
import ResumeUploadForm from '../../components/resumes/ResumeUploadForm';
import { EmptyState } from '../../components/ui/Feedback';
import { useToast } from '../../context/ToastContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { PENDING_API_MESSAGE } from '../../models/constants';

export default function Resumes() {
  useDocumentTitle('Mis CV');
  const toast = useToast();

  const handleUpload = () => {
    // Subir el archivo a la API se conecta en la etapa de integración.
    toast.info(PENDING_API_MESSAGE);
    return true;
  };

  return (
    <>
      <PageHeader title="Mis CV" subtitle="Guarda varias versiones de tu hoja de vida y elige la principal." />
      <div className="split-layout">
        <ResumeUploadForm onSubmit={handleUpload} />
        <section className="card" aria-labelledby="cv-list-title">
          <h2 id="cv-list-title" className="card-title">
            CV guardados
          </h2>
          <EmptyState icon="▤" title="Todavía no has subido tu CV">
            Cuando subas uno aparecerá aquí, con la opción de descargarlo o marcarlo como principal.
          </EmptyState>
        </section>
      </div>
    </>
  );
}
