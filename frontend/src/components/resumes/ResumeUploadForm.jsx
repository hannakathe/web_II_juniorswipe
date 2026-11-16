import { useRef, useState } from 'react';
import { useForm } from '../../hooks/useForm';
import { RESUME_RULES } from '../../models/constants';
import { formatBytes } from '../../utils/format';
import { fileSize, fileType, maxLength, required } from '../../utils/validators';
import Button from '../ui/Button';
import FormField from '../ui/FormField';

const SCHEMA = {
  title: [required('Ponle un nombre a tu CV'), maxLength(150)],
  summary: [maxLength(500)],
  file: [fileType(RESUME_RULES.extensions), fileSize(RESUME_RULES.maxBytes)],
};

// Formulario para subir un CV con zona de arrastrar y soltar.
// onSubmit recibe un FormData con title, summary y file (opcional).
export default function ResumeUploadForm({ submitting = false, onSubmit }) {
  const { values, errors, setValue, validateAll, reset, field } = useForm(
    { title: '', summary: '', file: null },
    SCHEMA,
  );
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const pickFile = (file) => {
    const patch = { file: file || null };
    // Si aún no hay nombre, se propone el del archivo sin extensión.
    if (!values.title && file) patch.title = file.name.replace(/\.[^.]+$/, '');
    setValue(patch, undefined, { touch: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;
    const fd = new FormData();
    fd.append('title', values.title.trim());
    fd.append('summary', values.summary.trim());
    if (values.file) fd.append('file', values.file);
    const result = onSubmit(fd);
    // Si el envío sale bien, se limpia el formulario.
    Promise.resolve(result).then((ok) => {
      if (ok !== false) {
        reset();
        if (inputRef.current) inputRef.current.value = '';
      }
    });
  };

  return (
    <form className="card form-stack" onSubmit={handleSubmit} noValidate>
      <h2 className="card-title">Subir un CV</h2>

      <div
        className={`dropzone${dragging ? ' dragging' : ''}${errors.file ? ' has-error' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pickFile(e.dataTransfer.files[0]);
        }}
      >
        <span className="dropzone-icon" aria-hidden="true">
          ⇪
        </span>
        {values.file ? (
          <p>
            <strong>{values.file.name}</strong> · {formatBytes(values.file.size)}
          </p>
        ) : (
          <p>Arrastra tu archivo aquí o</p>
        )}
        <label className="btn btn-ghost btn-sm">
          {values.file ? 'Cambiar archivo' : 'Elegir archivo'}
          <input
            ref={inputRef}
            type="file"
            className="visually-hidden"
            accept={RESUME_RULES.extensions.join(',')}
            onChange={(e) => pickFile(e.target.files[0])}
          />
        </label>
        <p className="field-hint">PDF, Word o texto · máximo {formatBytes(RESUME_RULES.maxBytes)}</p>
        {errors.file && (
          <p className="field-error" role="alert">
            {errors.file}
          </p>
        )}
      </div>

      <FormField label="Nombre del CV" placeholder="Ej. CV Diseño 2026" required {...field('title')} />
      <FormField
        as="textarea"
        rows={3}
        label="Resumen"
        placeholder="¿Para qué tipo de cargos usas este CV?"
        {...field('summary')}
      />
      <div className="form-actions">
        <Button type="submit" loading={submitting}>
          Subir CV
        </Button>
      </div>
    </form>
  );
}
