import { useForm } from '../../hooks/useForm';
import { PROJECT_STATUSES, toOptions } from '../../models/constants';
import { maxLength, minLength, required } from '../../utils/validators';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import TagInput from '../ui/TagInput';

const EMPTY = { title: '', description: '', status: 'draft', tools: [] };

const SCHEMA = {
  title: [required('Ponle un título a tu proyecto'), minLength(3), maxLength(150)],
  description: [maxLength(1000)],
};

// Formulario para crear o editar un proyecto / evidencia.
// onSubmit recibe { title, description, status, tech_stack } con el formato de la API.
export default function ProjectForm({ initialValues, submitting = false, submitLabel = 'Guardar proyecto', onSubmit, onCancel }) {
  const start = initialValues
    ? {
        ...EMPTY,
        ...initialValues,
        tools: (initialValues.tech_stack || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      }
    : EMPTY;
  const { values, setValue, validateAll, field } = useForm(start, SCHEMA);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status,
      tech_stack: values.tools.join(', '),
    });
  };

  return (
    <form className="form-stack" onSubmit={handleSubmit} noValidate>
      <FormField
        label="Título"
        placeholder="Ej. Rebranding de una cafetería"
        required
        maxLength={150}
        {...field('title')}
      />
      <FormField
        as="textarea"
        label="Descripción"
        placeholder="¿Qué hiciste, para quién y qué resultado obtuviste?"
        hint={`${values.description.length}/1000 caracteres`}
        {...field('description')}
      />
      <FormField as="select" label="Estado" {...field('status')}>
        {toOptions(PROJECT_STATUSES).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </FormField>
      <TagInput
        label="Herramientas y habilidades aplicadas"
        value={values.tools}
        onChange={(tools) => setValue('tools', tools)}
        placeholder="Ej. Figma, Excel, Python"
        max={10}
      />
      <div className="form-actions">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
