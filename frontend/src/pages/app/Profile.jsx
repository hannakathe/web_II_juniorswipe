import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../../components/layout/PageHeader';
import ProfileForm from '../../components/profile/ProfileForm';
import ProfilePreview from '../../components/profile/ProfilePreview';
import Button from '../../components/ui/Button';
import { Alert, Loader } from '../../components/ui/Feedback';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useForm } from '../../hooks/useForm';
import { profileService } from '../../services';
import { errorMessage } from '../../utils/apiErrors';
import { PROFILE_SCHEMA } from '../../utils/profile';

// El formulario se monta cuando ya llegaron los datos, para iniciar con ellos.
function ProfileEditor({ initial, isCompany, onSaved }) {
  const toast = useToast();
  const form = useForm(initial, PROFILE_SCHEMA);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.validateAll()) {
      toast.error('Revisa los campos marcados en rojo.');
      return;
    }
    setSaving(true);
    try {
      // El nombre de la cuenta no se edita desde el perfil.
      const payload = { ...form.values };
      delete payload.full_name;
      await profileService.update({
        ...payload,
        headline: payload.headline.trim(),
        bio: payload.bio.trim(),
        location: payload.location.trim(),
        website: payload.website.trim(),
        company_name: payload.company_name.trim() || null,
      });
      toast.success('Perfil guardado.');
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="split-layout">
      <ProfileForm form={form} isCompany={isCompany} submitting={saving} onSubmit={handleSubmit} />
      <ProfilePreview values={form.values} />
    </div>
  );
}

export default function Profile() {
  useDocumentTitle('Mi perfil');
  const { user, refresh } = useAuth();
  const [initial, setInitial] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const p = await profileService.get();
      setInitial({
        full_name: user.full_name || '',
        company_name: p.company_name || '',
        headline: p.headline || '',
        bio: p.bio || '',
        location: p.location || '',
        website: p.website || '',
        skills: p.skills || [],
      });
    } catch (err) {
      setError(errorMessage(err));
    }
  }, [user.full_name]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  return (
    <>
      <PageHeader title="Mi perfil" subtitle="Lo que escribas aquí es lo primero que verán las empresas." />
      {error && (
        <Alert type="error" action={<Button variant="ghost" size="sm" onClick={load}>Reintentar</Button>}>
          {error}
        </Alert>
      )}
      {!error && !initial && <Loader label="Cargando tu perfil…" />}
      {initial && <ProfileEditor initial={initial} isCompany={user.role === 'company'} onSaved={refresh} />}
    </>
  );
}
