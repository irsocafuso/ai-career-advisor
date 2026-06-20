import { useEffect, useState } from 'react'
import { fetchReports } from '../services/apiService'
import HistoryList from '../components/history/HistoryList'
import DiffViewer from '../components/history/DiffViewer'
import { History, GitCompare } from 'lucide-react'

export default function HistoryPage() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [view, setView] = useState('list') // 'list' | 'compare'
  const [selectedA, setSelectedA] = useState(null)
  const [selectedB, setSelectedB] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchReports()
        setReports(data.reports || [])
        if (data.reports?.length >= 2) {
          setSelectedA(data.reports[data.reports.length - 1]) // mais antigo
          setSelectedB(data.reports[0]) // mais recente
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header">
          <h1><History size={28} /> Histórico de Análises</h1>
          <p>{reports.length} análise{reports.length !== 1 ? 's' : ''} encontrada{reports.length !== 1 ? 's' : ''}</p>
        </div>

        {reports.length >= 2 && (
          <div className="view-toggle">
            <button
              className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setView('list')}
            >
              Lista
            </button>
            <button
              id="compare-btn"
              className={`btn btn-sm ${view === 'compare' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setView('compare')}
            >
              <GitCompare size={16} /> Comparar
            </button>
          </div>
        )}

        {loading && <div className="loading-screen"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">{error}</div>}

        {!loading && view === 'list' && (
          <HistoryList reports={reports} />
        )}

        {!loading && view === 'compare' && reports.length >= 2 && (
          <div className="compare-section">
            <div className="compare-selectors">
              <div className="form-group">
                <label>Análise A (anterior)</label>
                <select
                  value={selectedA?.id || ''}
                  onChange={(e) => setSelectedA(reports.find(r => r.id === e.target.value))}
                >
                  {reports.map((r, i) => (
                    <option key={r.id} value={r.id}>
                      Análise #{reports.length - i} — {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Análise B (mais recente)</label>
                <select
                  value={selectedB?.id || ''}
                  onChange={(e) => setSelectedB(reports.find(r => r.id === e.target.value))}
                >
                  {reports.map((r, i) => (
                    <option key={r.id} value={r.id}>
                      Análise #{reports.length - i} — {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <DiffViewer reportA={selectedA} reportB={selectedB} />
          </div>
        )}

        {!loading && reports.length < 2 && view === 'compare' && (
          <div className="alert alert-warning">
            ℹ️ Você precisa de pelo menos 2 análises para usar a comparação.
          </div>
        )}
      </div>
    </div>
  )
}
