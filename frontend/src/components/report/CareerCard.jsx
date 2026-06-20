import { useState } from 'react'
import ScoreBar from './ScoreBar'
import { ChevronDown, ChevronUp, BookOpen, Award, Wrench } from 'lucide-react'

export default function CareerCard({ career, rank }) {
  const [expanded, setExpanded] = useState(rank === 0)

  const typeIcon = { curso: '🎓', livro: '📚', certificação: '🏆' }

  return (
    <div className={`career-card ${expanded ? 'expanded' : ''}`}>
      <div className="career-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="career-rank">#{rank + 1}</div>
        <div className="career-info">
          <h3 className="career-name">{career.name}</h3>
          <ScoreBar score={career.confidenceScore} label="Compatibilidade" />
        </div>
        <button className="btn-icon">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {expanded && (
        <div className="career-card-body">
          <p className="career-description">{career.description}</p>

          <div className="career-section">
            <h4><BookOpen size={16} /> Por que combina com você</h4>
            <p>{career.whyItMatches}</p>
          </div>

          {career.skillsToDevelop?.length > 0 && (
            <div className="career-section">
              <h4><Wrench size={16} /> Habilidades para Desenvolver</h4>
              <div className="tag-list">
                {career.skillsToDevelop.map((skill, i) => (
                  <span key={i} className="tag tag-warning">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {career.learningPath?.length > 0 && (
            <div className="career-section">
              <h4><Award size={16} /> Trilha de Aprendizado</h4>
              <ul className="learning-path-list">
                {career.learningPath.map((item, i) => (
                  <li key={i} className="learning-item">
                    <span className="learning-type-icon">{typeIcon[item.type] || '📌'}</span>
                    <div>
                      <span className="learning-title">{item.title}</span>
                      <span className="learning-type-badge">{item.type}</span>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="learning-link">
                          Ver recurso →
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
