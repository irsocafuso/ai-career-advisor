import { Bot } from 'lucide-react'

export default function AiDisclaimer() {
  return (
    <div className="ai-disclaimer">
      <Bot size={16} />
      <p>
        <strong>Aviso:</strong> As recomendações e análises exibidas são geradas por Inteligência Artificial (Gemini).
        Os resultados são orientativos e não substituem a avaliação de um orientador profissional de carreira.
        Os scores de compatibilidade são estimativas relativas, não métricas estatísticas.
      </p>
    </div>
  )
}
