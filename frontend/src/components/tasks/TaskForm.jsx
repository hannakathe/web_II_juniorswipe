import { useForm } from '../../hooks/useForm';
import { TASK_PRIORITIES, toOptions } from '../../models/constants';
import { maxLength, minLength, notPastDate, required } from '../../utils/validators';
import Button from '../ui/Button';
import FormField from '../ui/FormField';

const EMPTY = { title: '', priority: 'medium', due_date: '' };

const SCHEMA = {
  title: [required('Escribe qué hay que hacer'), minLength(3), maxLength(150)],
  due_date: [notPastDate()],
};

// Formulario en línea para agregar una actividad a un proyecto.
// onSubmit devuelve una promesa; si se resuelve, el formulario se limpia.
export default function TaskForm({ submitting = false, onSubmit }) {
  const { values, validateAll, reset, field } = useForm(EMPTY, SCHEMA);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    const ok = await onSubmit({
      title: values.title.trim(),
      priority: values.priority,
      due_date: values.due_date || null,
    });
    if (ok !== false) reset();
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <FormField label="Nueva actividad" placeholder="Ej. Diseñar el logotipo" className="task-form-title" {...field('title')} />
      <FormField as="select" label="Prioridad" {...field('priority')}>
        {toOptions(TASK_PRIORITIES).map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </FormField>
      <FormField label="Fecha límite" type="date" {...field('due_date')} />
      <Button type="submit" loading={submitting} className="task-form-submit">
        Agregar
      </Button>
    </form>
  );
}
