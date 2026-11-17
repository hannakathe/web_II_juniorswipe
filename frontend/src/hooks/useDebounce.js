import { useEffect, useState } from 'react';

// Devuelve el valor solo cuando deja de cambiar durante `delay` ms (útil en búsquedas).
export function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
