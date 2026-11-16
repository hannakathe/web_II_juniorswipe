import { useId, useState } from 'react';

// Campo para escribir etiquetas (habilidades, herramientas). Enter o coma agregan una.
export default function TagInput({ label, value = [], onChange, placeholder, hint, max = 15 }) {
  const id = useId();
  const [draft, setDraft] = useState('');

  // Agrega una o varias etiquetas (separadas por coma), sin repetir y sin pasar del máximo.
  const add = (raw, rest = '') => {
    const next = [...value];
    raw.split(',').forEach((part) => {
      const tag = part.trim();
      if (tag && next.length < max && !next.some((t) => t.toLowerCase() === tag.toLowerCase())) next.push(tag);
    });
    if (next.length !== value.length) onChange(next);
    setDraft(rest);
  };

  // La coma también llega por pegado o autocompletado del celular, sin evento de tecla.
  const onInputChange = (e) => {
    const text = e.target.value;
    if (text.includes(',')) {
      const cut = text.lastIndexOf(',');
      add(text.slice(0, cut), text.slice(cut + 1).trimStart());
    } else {
      setDraft(text);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="tag-input">
        {value.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
            <button type="button" aria-label={`Quitar ${tag}`} onClick={() => onChange(value.filter((t) => t !== tag))}>
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          onBlur={() => draft && add(draft)}
          placeholder={value.length >= max ? `Máximo ${max}` : placeholder}
          disabled={value.length >= max}
        />
      </div>
      <p className="field-hint">{hint || `Presiona Enter o coma para agregar · ${value.length}/${max}`}</p>
    </div>
  );
}
