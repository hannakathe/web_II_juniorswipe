const STEPS = [
  {
    title: 'Sube tu CV',
    text: 'Arrastra y suelta tu CV en PDF o DOCX. La IA extraerá toda tu información automáticamente.',
  },
  {
    title: 'Análisis Automático',
    text: 'Nuestro motor de IA analiza tus skills, experiencia y te conecta con ofertas compatibles.',
  },
  {
    title: 'Recibe Matches',
    text: 'Explora ofertas con match score, identifica gaps y aplica con un solo clic.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section how-it-works" id="como-funciona">
      <div className="container">
        <h2 className="section-title">Cómo Funciona</h2>
        <p className="section-subtitle">3 pasos simples para empezar tu búsqueda laboral</p>

        <div className="steps">
          {STEPS.map((s, i) => (
            <div className="step" key={s.title}>
              <div className="step-number">{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}