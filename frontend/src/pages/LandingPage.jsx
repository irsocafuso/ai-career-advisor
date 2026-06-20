import { Link } from 'react-router-dom'
import { BrainCircuit, Sparkles, BarChart3, History, Shield } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} />
            Powered by Gemini AI
          </div>
          <h1 className="hero-title">
            Descubra sua<br />
            <span className="gradient-text">carreira ideal</span><br />
            com IA
          </h1>
          <p className="hero-subtitle">
            Descreva seus interesses, habilidades e objetivos. Nossa IA analisa seu perfil
            e recomenda as carreiras que mais combinam com você — em português, de forma personalizada.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Começar gratuitamente
            </Link>
            <Link to="/login" className="btn btn-ghost btn-lg">
              Já tenho conta
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-demo">
            <div className="demo-header">
              <BrainCircuit size={24} className="brand-icon" />
              <span>Análise de Carreira</span>
            </div>
            <div className="demo-career">
              <span className="demo-rank">#1</span>
              <div>
                <strong>Engenharia de Software</strong>
                <div className="demo-bar"><div className="demo-fill" style={{width:'92%'}} /></div>
                <small>92% de compatibilidade</small>
              </div>
            </div>
            <div className="demo-career">
              <span className="demo-rank">#2</span>
              <div>
                <strong>Ciência de Dados</strong>
                <div className="demo-bar"><div className="demo-fill" style={{width:'85%'}} /></div>
                <small>85% de compatibilidade</small>
              </div>
            </div>
            <div className="demo-career">
              <span className="demo-rank">#3</span>
              <div>
                <strong>UX Design</strong>
                <div className="demo-bar"><div className="demo-fill" style={{width:'78%'}} /></div>
                <small>78% de compatibilidade</small>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="landing-features">
        <h2>Como funciona</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✍️</div>
            <h3>Descreva-se</h3>
            <p>Preencha um formulário guiado sobre seus interesses, habilidades, personalidade e objetivos.</p>
          </div>
          <div className="feature-card">
            <BrainCircuit size={32} className="feature-icon-svg" />
            <h3>IA Analisa</h3>
            <p>O Gemini AI processa seu perfil e identifica padrões, pontos fortes e oportunidades.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Receba Recomendações</h3>
            <p>5 carreiras personalizadas com trilha de aprendizado e recursos para cada uma.</p>
          </div>
          <div className="feature-card">
            <History size={32} className="feature-icon-svg" />
            <h3>Acompanhe sua Evolução</h3>
            <p>Compare análises ao longo do tempo e veja como seu perfil evolui.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 AI Career Advisor — Projeto Acadêmico</p>
        <p className="footer-disclaimer">Recomendações geradas por IA. Consulte um orientador profissional para decisões importantes.</p>
      </footer>
    </div>
  )
}
