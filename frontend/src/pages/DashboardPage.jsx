import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchReports } from '../services/apiService'
import { BrainCircuit, PlusCircle, FileText, History } from 'lucide-react'
import CareerCard from '../components/report/CareerCard'
import AiDisclaimer from '../components/ui/AiDisclaimer'

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [latestReport, setLatestReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchReports()
        if (data.reports?.length > 0) {
          setLatestReport(data.reports[0])
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const firstName = user?.displayName?.split(' ')[0] || 'Usuário'

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Boas-vindas */}
        <div className="dashboard-welcome">
          <div className="welcome-avatar">
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
            ) : (
              <span>{firstName[0].toUpperCase()}</span>
            )}
          </div>
          <div>
            <h1>Olá, <span className="gradient-text">{firstName}</span>! 👋</h1>
            <p>{user?.email}</p>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="dashboard-actions">
          <button
            id="new-analysis-btn"
            className="action-card action-primary"
            onClick={() => navigate('/profile/new')}
          >
            <PlusCircle size={32} />
            <h3>Nova Análise</h3>
            <p>Descreva seu perfil e receba recomendações atualizadas</p>
          </button>
          <button
            className="action-card action-secondary"
            onClick={() => navigate('/history')}
          >
            <History size={32} />
            <h3>Histórico</h3>
            <p>Compare suas análises anteriores</p>
          </button>
        </div>

        {loading && (
          <div className="loading-screen">
            <div className="spinner" />
            <p>Carregando seu relatório...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-warning">
            ⚠️ Não foi possível carregar os dados: {error}. Verifique se o backend está rodando.
          </div>
        )}

        {!loading && !latestReport && !error && (
          <div className="empty-dashboard">
            <BrainCircuit size={64} className="empty-icon" />
            <h2>Nenhuma análise ainda</h2>
            <p>Clique em "Nova Análise" para descobrir as carreiras que mais combinam com você.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/profile/new')}>
              <PlusCircle size={18} /> Começar agora
            </button>
          </div>
        )}

        {!loading && latestReport && (
          <div className="latest-report">
            <div className="section-header">
              <FileText size={20} />
              <h2>Última Análise</h2>
              <span className="date-badge">
                {new Date(latestReport.createdAt).toLocaleDateString('pt-BR')}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/report/${latestReport.id}`)}>
                Ver completo →
              </button>
            </div>

            <AiDisclaimer />

            <div className="report-summary-card card">
              <h3>Resumo do Perfil</h3>
              <p>{latestReport.summary}</p>
              <div className="summary-tags">
                <div>
                  <strong>💪 Pontos fortes:</strong>
                  <div className="tag-list">
                    {latestReport.extractedData?.strengths?.slice(0, 3).map((s, i) => (
                      <span key={i} className="tag tag-success">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-careers">
              <h3>🎯 Carreiras Recomendadas</h3>
              {latestReport.careers?.slice(0, 3).map((career, i) => (
                <CareerCard key={i} career={career} rank={i} />
              ))}
              {latestReport.careers?.length > 3 && (
                <button className="btn btn-ghost" onClick={() => navigate(`/report/${latestReport.id}`)}>
                  Ver todas as {latestReport.careers.length} carreiras →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
