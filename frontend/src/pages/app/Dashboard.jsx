import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/layout/PageHeader';
import { Alert, Badge, Loader, ProgressBar, StatCard } from '../../components/ui/Feedback';
import { useAuth } from '../../context/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { PROJECT_STATUSES } from '../../models/constants';
import { projectService, taskService, userService } from '../../services';
import { errorMessage } from '../../utils/apiErrors';
import { formatDate } from '../../utils/format';
import { profileCompleteness } from '../../utils/profile';

const TIPS = [
  'Describe resultados, no solo tareas: “aumenté las ventas un 15 %” dice más que “hice publicidad”.',
  'Incluye las herramientas que usaste en cada proyecto; así el matching es más preciso.',
  'Un perfil completo recibe más visitas de empresas.',
];

export default function Dashboard() {
  useDocumentTitle('Panel');
  const { user } = useAuth();
  const isDeveloper = user.role === 'developer';
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const [summary, recent, tasks] = await Promise.all([
        userService.summary(),
        projectService.list({ per_page: 3 }),
        taskService.list({ per_page: 100 }),
      ]);
      const done = tasks.items.filter((t) => t.status === 'done').length;
      setData({ summary, recent: recent.items, tasksTotal: tasks.total, tasksDone: done });
    } catch (err) {
      setError(errorMessage(err));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const firstName = user.full_name.split(' ')[0];

  if (error) {
    return (
      <>
        <PageHeader title={`Hola, ${firstName} 👋`} />
        <Alert type="error" action={<button type="button" className="btn btn-ghost btn-sm" onClick={load}>Reintentar</button>}>
          {error}
        </Alert>
      </>
    );
  }
  if (!data) return <Loader label="Cargando tu panel…" />;

  const { summary, recent, tasksTotal, tasksDone } = data;
  const profile = summary.profile || {};
  const completeness = profileCompleteness({
    full_name: summary.full_name,
    headline: profile.headline,
    bio: profile.bio,
    location: profile.location,
    website: profile.website,
    skills: profile.skills || [],
  });

  const steps = [
    { done: completeness === 100, to: '/app/perfil', title: 'Completa tu perfil', cta: 'Editar perfil' },
    { done: summary.project_count > 0, to: '/app/proyectos?nuevo=1', title: 'Registra una evidencia', cta: 'Nuevo proyecto' },
    ...(isDeveloper ? [{ done: summary.resume_count > 0, to: '/app/cv', title: 'Sube tu CV', cta: 'Subir CV' }] : []),
  ];
  const pending = steps.filter((s) => !s.done);

  return (
    <>
      <PageHeader
        title={`Hola, ${firstName} 👋`}
        subtitle={isDeveloper ? 'Este es el estado de tu perfil de evidencias.' : 'Este es el resumen de la cuenta de tu empresa.'}
      />

      <section className="stats-grid" aria-label="Resumen">
        <StatCard icon="◧" value={summary.project_count} label="Proyectos" />
        <StatCard icon="✓" value={`${tasksDone}/${tasksTotal}`} label="Actividades hechas" />
        {isDeveloper && <StatCard icon="▤" value={summary.resume_count} label="CV guardados" />}
        <StatCard icon="◉" value={`${completeness}%`} label="Perfil completo" />
      </section>

      <div className="split-layout">
        <section className="card" aria-labelledby="recent-title">
          <div className="card-head">
            <h2 id="recent-title" className="card-title">
              Proyectos recientes
            </h2>
            <Link to="/app/proyectos" className="link-more">
              Ver todos →
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="muted">Todavía no has registrado proyectos.</p>
          ) : (
            <ul className="recent-list">
              {recent.map((p) => (
                <li key={p.id}>
                  <Link to={`/app/proyectos/${p.id}`}>{p.title}</Link>
                  <span className="muted">{formatDate(p.created_at)}</span>
                  <Badge tone={PROJECT_STATUSES[p.status]?.tone}>{PROJECT_STATUSES[p.status]?.label}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card" aria-labelledby="next-title">
          <h2 id="next-title" className="card-title">
            {pending.length ? 'Siguientes pasos' : '¡Todo al día!'}
          </h2>
          <ProgressBar value={((steps.length - pending.length) / steps.length) * 100} label="Primeros pasos" />
          {pending.length ? (
            <ul className="next-steps">
              {pending.map((s) => (
                <li key={s.to}>
                  <span>{s.title}</span>
                  <Link to={s.to} className="btn btn-primary btn-sm">
                    {s.cta}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="tips-list">
              {TIPS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
