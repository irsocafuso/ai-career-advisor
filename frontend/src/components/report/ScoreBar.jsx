export default function ScoreBar({ score, label }) {
  const getColor = (s) => {
    if (s >= 80) return 'var(--color-success)'
    if (s >= 60) return 'var(--color-warning)'
    return 'var(--color-danger)'
  }

  return (
    <div className="score-bar-wrapper">
      {label && <span className="score-label">{label}</span>}
      <div className="score-bar-track">
        <div
          className="score-bar-fill"
          style={{ width: `${score}%`, background: getColor(score) }}
        />
      </div>
      <span className="score-value">{score}%</span>
    </div>
  )
}
