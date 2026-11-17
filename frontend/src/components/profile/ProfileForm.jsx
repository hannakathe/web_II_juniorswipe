import Button from '../ui/Button';
import FormField from '../ui/FormField';
import TagInput from '../ui/TagInput';

// Formulario del perfil. El estado vive en la página para que la vista previa se actualice.
export default function ProfileForm({ form, isCompany = false, submitting = false, onSubmit }) {
  const { values, setValue, field } = form;

  return (
    <form className="card form-stack" onSubmit={onSubmit} noValidate>
      <h2 className="card-title">Información pública</h2>
      <FormField
        label={isCompany ? 'Nombre de la cuenta' : 'Nombre completo'}
        hint="Es el nombre con el que creaste la cuenta; por ahora no se puede cambiar."
        readOnly
        {...field('full_name')}
      />
      {isCompany && <FormField label="Nombre de la empresa" placeholder="Ej. Estudio Creativo" {...field('company_name')} />}
      <FormField
        label="Titular"
        placeholder={isCompany ? 'Ej. Agencia de diseño que contrata talento junior' : 'Ej. Diseñadora gráfica recién graduada'}
        hint="Una frase que resuma quién eres profesionalmente."
        {...field('headline')}
      />
      <FormField
        as="textarea"
        label={isCompany ? 'Sobre la empresa' : 'Sobre mí'}
        placeholder={isCompany ? 'Qué hace la empresa y qué perfiles busca.' : 'Cuéntale a las empresas qué te apasiona y qué sabes hacer.'}
        hint={`${values.bio.length}/1000 caracteres`}
        {...field('bio')}
      />
      <div className="form-row">
        <FormField label="Ciudad" placeholder="Ej. Bogotá, Colombia" {...field('location')} />
        <FormField label="Portafolio o sitio web" type="url" placeholder="https://" {...field('website')} />
      </div>
      <TagInput
        label={isCompany ? 'Habilidades que buscan' : 'Habilidades'}
        value={values.skills}
        onChange={(skills) => setValue('skills', skills)}
        placeholder="Ej. Excel, Atención al cliente, Figma"
      />
      <div className="form-actions">
        <Button type="submit" loading={submitting}>
          Guardar perfil
        </Button>
      </div>
    </form>
  );
}
