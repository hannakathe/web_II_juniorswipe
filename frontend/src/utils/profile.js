import { maxLength, url } from './validators';

export const PROFILE_SCHEMA = {
  full_name: [maxLength(150)],
  headline: [maxLength(150)],
  bio: [maxLength(1000)],
  location: [maxLength(120)],
  website: [url()],
};

const COMPLETENESS_FIELDS = ['full_name', 'headline', 'bio', 'location', 'website', 'skills'];

// Porcentaje del perfil que está diligenciado (0 a 100).
export function profileCompleteness(values) {
  const filled = COMPLETENESS_FIELDS.filter((k) =>
    Array.isArray(values[k]) ? values[k].length > 0 : String(values[k] || '').trim() !== '',
  ).length;
  return Math.round((filled / COMPLETENESS_FIELDS.length) * 100);
}
