import PageHeader from '../../components/layout/PageHeader';
import ProfileForm from '../../components/profile/ProfileForm';
import ProfilePreview from '../../components/profile/ProfilePreview';
import { useToast } from '../../context/ToastContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useForm } from '../../hooks/useForm';
import { PENDING_API_MESSAGE } from '../../models/constants';
import { PROFILE_SCHEMA } from '../../utils/profile';

const EMPTY_PROFILE = { full_name: '', headline: '', bio: '', location: '', website: '', skills: [] };

export default function Profile() {
  useDocumentTitle('Mi perfil');
  const toast = useToast();
  const form = useForm(EMPTY_PROFILE, PROFILE_SCHEMA);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.validateAll()) {
      toast.error('Revisa los campos marcados en rojo.');
      return;
    }
    // Guardar el perfil en la API se conecta en la etapa de integración.
    toast.info(PENDING_API_MESSAGE);
  };

  return (
    <>
      <PageHeader title="Mi perfil" subtitle="Lo que escribas aquí es lo primero que verán las empresas." />
      <div className="split-layout">
        <ProfileForm form={form} onSubmit={handleSubmit} />
        <ProfilePreview values={form.values} />
      </div>
    </>
  );
}
