import { useNavigate } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'

export default function HistoryList({ reports }) {
  const navigate = useNavigate()

  if (!reports || reports.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhuma análise encontrada.</p>
      </div>
    )
  }

  return (
    <div className="history-list">
      {reports.map((report, index) => (
        <div key={report.id} className="history-item" onClick={() => navigate(`/report/${report.id}`)}>
          <div className="history-item-header">
            <div className="history-index">Análise #{reports.length - index}</div>
            <div className="history-date">
              <Clock size={14} />
              {new Date(report.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </div>
          </div>
          <p className="history-summary">{report.summary?.substring(0, 150)}...</p>
          <div className="history-careers">
            {report.careers?.slice(0, 3).map((c, i) => (
              <span key={i} className="tag tag-primary">{c.name}</span>
            ))}
          </div>
          <button className="btn-link">
            Ver relatório <ArrowRight size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
