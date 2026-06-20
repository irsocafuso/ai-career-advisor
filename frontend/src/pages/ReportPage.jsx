import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchReport } from '../services/apiService'
import CareerCard from '../components/report/CareerCard'
import AiDisclaimer from '../components/ui/AiDisclaimer'
import { User, Zap, AlertTriangle, Target, PlusCircle } from 'lucide-react'

export default function ReportPage() {
  const { reportId } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchReport(reportId)
        setReport(data.report)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [reportId])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Carregando relatório...</p>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="error-screen">
        <AlertTriangle size={48} />
        <h2>Relatório não encontrado</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Voltar ao Dashboard
        </button>
      </div>
    )
  }

  const { extractedData, careers, summary } = report

  return (
    <div className="report-page">
      <div className="report-container">
        <div className="report-header">
          <h1 className="gradient-text">Seu Relatório de Carreira</h1>
          <p className="report-date">
            Gerado em {new Date(report.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
          <AiDisclaimer />
        </div>

        {/* Sumário */}
        <section className="report-section card">
          <h2><User size={20} /> Perfil Profissional</h2>
          <p className="report-summary">{summary}</p>
        </section>

        {/* Pontos fortes e fracos */}
        <div className="report-grid-2">
          <section className="report-section card card-success">
            <h2><Zap size={20} /> Pontos Fortes</h2>
            <ul className="trait-list">
              {extractedData?.strengths?.map((s, i) => (
                <li key={i}><span className="trait-dot dot-success" />{s}</li>
              ))}
            </ul>
          </section>

          <section className="report-section card card-danger">
            <h2><AlertTriangle size={20} /> Pontos a Desenvolver</h2>
            <ul className="trait-list">
              {extractedData?.weaknesses?.map((w, i) => (
                <li key={i}><span className="trait-dot dot-danger" />{w}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* Tags de skills/traits */}
        <section className="report-section card">
          <h2><Target size={20} /> Perfil Extraído pela IA</h2>
          <div className="profile-tags-grid">
            <div>
              <h4>Interesses</h4>
              <div className="tag-list">
                {extractedData?.interests?.map((t, i) => <span key={i} className="tag tag-primary">{t}</span>)}
              </div>
            </div>
            <div>
              <h4>Habilidades</h4>
              <div className="tag-list">
                {extractedData?.skills?.map((t, i) => <span key={i} className="tag tag-success">{t}</span>)}
              </div>
            </div>
            <div>
              <h4>Traços de Personalidade</h4>
              <div className="tag-list">
                {extractedData?.personalityTraits?.map((t, i) => <span key={i} className="tag tag-purple">{t}</span>)}
              </div>
            </div>
            <div>
              <h4>Objetivos</h4>
              <div className="tag-list">
                {extractedData?.careerGoals?.map((t, i) => <span key={i} className="tag tag-warning">{t}</span>)}
              </div>
            </div>
          </div>

          {extractedData?.missingInfo?.length > 0 && (
            <div className="missing-info">
              <AlertTriangle size={16} />
              <strong>Informações que poderiam melhorar a análise:</strong>
              <ul>
                {extractedData.missingInfo.map((m, i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          )}
        </section>

        {/* Carreiras */}
        <section className="report-section">
          <h2>🎯 Carreiras Recomendadas</h2>
          <p className="section-subtitle">Clique em cada carreira para ver detalhes e trilha de aprendizado</p>
          <div className="careers-list">
            {careers?.map((career, i) => (
              <CareerCard key={i} career={career} rank={i} />
            ))}
          </div>
        </section>

        <div className="report-actions">
          <button className="btn btn-primary" onClick={() => navigate('/profile/new')}>
            <PlusCircle size={18} /> Nova Análise
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('/history')}>
            Ver Histórico
          </button>
        </div>
      </div>
    </div>
  )
}
