// enlace con desplazamiento suave a una sección de la landing
export default function SectionLink({ to, className, onNavigate, children }) {
  const onClick = (e) => {
    onNavigate?.();
    const target = document.getElementById(to);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <a href={`#${to}`} className={className} onClick={onClick}>{children}</a>
  );
}