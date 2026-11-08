import dashboard from '../../assets/images/hero-illustration.webp'; //cambiar imagen por la que se decida usar

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text fade-in-up">
            <h1>Conecta tu talento con oportunidades perfectas</h1>
            <p>Plataforma de matching inteligente impulsada por IA que conecta el talento junior con
              empresas que buscan su perfil exacto.</p>
          </div>
          <div>
            <img src={heroImage} alt="Perfil de una recién graduada con sus evidencias y un 92% de match con una empresa" />
          </div>
        </div>
      </div>
    </section>
  );
}