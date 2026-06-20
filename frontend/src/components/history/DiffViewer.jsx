import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued'

export default function DiffViewer({ reportA, reportB }) {
  if (!reportA || !reportB) {
    return <p className="empty-state">Selecione dois relatórios para comparar.</p>
  }

  const formatReport = (report) => {
    const careers = report.careers?.map((c, i) =>
      `#${i + 1} ${c.name} (${c.confidenceScore}%)\n  → ${c.whyItMatches}`
    ).join('\n\n')

    const strengths = report.extractedData?.strengths?.join('\n• ')
    const weaknesses = report.extractedData?.weaknesses?.join('\n• ')

    return `=== SUMÁRIO ===\n${report.summary}\n\n=== PONTOS FORTES ===\n• ${strengths}\n\n=== PONTOS FRACOS ===\n• ${weaknesses}\n\n=== CARREIRAS RECOMENDADAS ===\n${careers}`
  }

  const dateA = new Date(reportA.createdAt).toLocaleDateString('pt-BR')
  const dateB = new Date(reportB.createdAt).toLocaleDateString('pt-BR')

  return (
    <div className="diff-viewer-wrapper">
      <div className="diff-headers">
        <span className="diff-header-label">Análise anterior — {dateA}</span>
        <span className="diff-header-label">Análise mais recente — {dateB}</span>
      </div>
      <ReactDiffViewer
        oldValue={formatReport(reportA)}
        newValue={formatReport(reportB)}
        splitView={true}
        compareMethod={DiffMethod.WORDS}
        useDarkTheme={true}
        leftTitle={`Análise de ${dateA}`}
        rightTitle={`Análise de ${dateB}`}
        styles={{
          variables: {
            dark: {
              diffViewerBackground: '#0f0f1a',
              addedBackground: '#1a3a1a',
              removedBackground: '#3a1a1a',
              wordAddedBackground: '#2d5a2d',
              wordRemovedBackground: '#5a2d2d',
              addedColor: '#a8e6a8',
              removedColor: '#e6a8a8',
            }
          }
        }}
      />
    </div>
  )
}
