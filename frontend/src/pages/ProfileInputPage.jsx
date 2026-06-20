import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeProfile } from '../services/apiService'
import { Sparkles, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react'
import AiDisclaimer from '../components/ui/AiDisclaimer'

const SECTIONS = [
  {
    key: 'interests',
    title: '📚 Interesses e Matérias',
    description: 'Conte-nos sobre o que você mais gosta de estudar e aprender.',
    placeholder: 'Exemplo: Gosto muito de matemática, especialmente álgebra. Tenho interesse em como a tecnologia funciona por trás dos aplicativos. Também me interesso por biologia e meio ambiente...',
    required: true,
  },
  {
    key: 'skills',
    title: '💪 Habilidades',
    description: 'Quais são suas habilidades técnicas, interpessoais e outras?',
    placeholder: 'Exemplo: Sei programar em Python básico, sou bom em resolver problemas lógicos. Tenho facilidade em me comunicar com as pessoas, liderança em projetos em grupo. Falo inglês intermediário...',
    required: true,
  },
  {
    key: 'personality',
    title: '🧠 Personalidade',
    description: 'Como você se descreve? Qual é o seu jeito de ser?',
    placeholder: 'Exemplo: Sou uma pessoa introvertida, prefiro trabalhar sozinha mas consigo trabalhar em equipe quando necessário. Sou perfeccionista, muito organizado e metódico. Tenho paciência para resolver problemas complexos...',
    required: true,
  },
  {
    key: 'goals',
    title: '🎯 Objetivos Profissionais',
    description: 'O que você quer alcançar na sua vida profissional?',
    placeholder: 'Exemplo: Quero ter uma carreira estável e bem remunerada. Em 5 anos, gostaria de trabalhar em uma empresa de tecnologia. Sonho em empreender meu próprio negócio no futuro. Quero impactar positivamente a sociedade...',
    required: true,
  },
  {
    key: 'hobbies',
    title: '🎮 Hobbies e Atividades',
    description: 'O que você faz no tempo livre? O que te energiza?',
    placeholder: 'Exemplo: Gosto de jogar xadrez, ler livros de ficção científica e assistir documentários sobre natureza. Faço esportes nos fins de semana e curto criar projetos de eletrônica no Arduino...',
    required: false,
  },
  {
    key: 'experiences',
    title: '📋 Experiências',
    description: 'Já trabalhou, fez estágio, projetos, cursos ou voluntariado?',
    placeholder: 'Exemplo: Fiz um curso de programação web por 3 meses. Participei de uma iniciação científica no colégio sobre botânica. Trabalhei como monitor de matemática. Desenvolvi um app simples de lista de tarefas...',
    required: false,
  },
  {
    key: 'additionalInfo',
    title: '➕ Mais sobre você',
    description: 'Qualquer informação adicional que ache relevante para sua análise de carreira.',
    placeholder: 'Exemplo: Tenho 18 anos e estou no 3° ano do ensino médio. Minha família é de baixa renda, então custo de faculdade é um fator importante. Tenho alguma dificuldade com atenção (TDAH diagnosticado)...',
    required: false,
  },
]

export default function ProfileInputPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const section = SECTIONS[currentStep]
  const isLastStep = currentStep === SECTIONS.length - 1
  const progress = ((currentStep + 1) / SECTIONS.length) * 100

  const handleAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [section.key]: value }))
  }

  const handleNext = () => {
    if (section.required && !answers[section.key]?.trim()) {
      setError('Esta seção é obrigatória. Por favor, preencha antes de continuar.')
      return
    }
    setError('')
    if (!isLastStep) {
      setCurrentStep((s) => s + 1)
    }
  }

  const handlePrev = () => {
    setError('')
    setCurrentStep((s) => s - 1)
  }

  const handleSubmit = async () => {
    const requiredSections = SECTIONS.filter((s) => s.required)
    for (const s of requiredSections) {
      if (!answers[s.key]?.trim()) {
        setError(`A seção "${s.title}" é obrigatória.`)
        return
      }
    }
    setError('')
    setLoading(true)
    try {
      const result = await analyzeProfile(answers)
      navigate(`/report/${result.reportId}`)
    } catch (err) {
      setError(`Erro ao gerar análise: ${err.message}. Verifique se o backend está rodando em http://localhost:8000`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-input-page">
      <div className="profile-input-container">
        <div className="profile-progress-bar">
          <div className="profile-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="profile-step-counter">
          Seção {currentStep + 1} de {SECTIONS.length}
        </div>

        <div className="profile-section">
          <h2 className="profile-section-title">{section.title}</h2>
          <p className="profile-section-desc">{section.description}</p>
          {section.required && <span className="required-badge">Obrigatório</span>}

          <textarea
            id={`section-${section.key}`}
            className="profile-textarea"
            rows={8}
            value={answers[section.key] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={section.placeholder}
          />

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        <div className="profile-nav">
          <button
            className="btn btn-ghost"
            onClick={handlePrev}
            disabled={currentStep === 0 || loading}
          >
            <ChevronLeft size={18} /> Anterior
          </button>

          {!isLastStep ? (
            <button className="btn btn-primary" onClick={handleNext} disabled={loading}>
              Próximo <ChevronRight size={18} />
            </button>
          ) : (
            <button
              id="submit-analysis-btn"
              className="btn btn-primary btn-glow"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-sm" />
                  Analisando com IA...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Gerar Análise
                </>
              )}
            </button>
          )}
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-card">
              <div className="spinner-lg" />
              <h3>Analisando seu perfil com Gemini AI...</h3>
              <p>Isso pode levar alguns segundos. Aguarde enquanto geramos suas recomendações personalizadas.</p>
            </div>
          </div>
        )}

        <AiDisclaimer />
      </div>
    </div>
  )
}
