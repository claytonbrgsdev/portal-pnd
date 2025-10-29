"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { submitSimuladoAttempt } from "@/lib/simulados"
import { Clock, CheckCircle, AlertCircle, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"

interface Question {
  id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e?: string
  correct_answer: string
  explanation?: string
}

interface Simulado {
  id: number
  title: string
  description: string
  total_questions: number
  duration_minutes: number
  difficulty_level: string
  subject_area: string
}

interface SimuladoInterfaceProps {
  simulado: Simulado
  questions: Question[]
}

export function SimuladoInterface({ simulado, questions }: SimuladoInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeLeft, setTimeLeft] = useState(simulado.duration_minutes * 60) // in seconds
  const [isFinished, setIsFinished] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isFinished) {
      handleFinishSimulado()
    }
  }, [timeLeft, isFinished])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleFinishSimulado = async () => {
    setIsSubmitting(true)
    const timeSpent = simulado.duration_minutes - Math.floor(timeLeft / 60)

    // Mock user ID - in real app, get from session
    const userId = 1

    const result = await submitSimuladoAttempt(userId, simulado.id, answers, timeSpent)

    if (result.success) {
      setResult(result)
      setIsFinished(true)
    }

    setIsSubmitting(false)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredQuestions = Object.keys(answers).length

  if (isFinished && result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Simulado Concluído!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{result.result.score}%</div>
                  <div className="text-sm text-gray-600">Sua Nota</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {result.correctAnswers}/{result.totalQuestions}
                  </div>
                  <div className="text-sm text-gray-600">Acertos</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {simulado.duration_minutes - Math.floor(timeLeft / 60)}min
                  </div>
                  <div className="text-sm text-gray-600">Tempo Gasto</div>
                </div>
              </div>

              <div className="text-left">
                <h3 className="font-semibold mb-2">Análise de Desempenho:</h3>
                <div className="space-y-2 text-sm">
                  {result.result.score >= 80 && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Excelente! Você está bem preparado para a PND.
                    </div>
                  )}
                  {result.result.score >= 60 && result.result.score < 80 && (
                    <div className="flex items-center text-yellow-600">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Bom desempenho! Continue estudando para melhorar ainda mais.
                    </div>
                  )}
                  {result.result.score < 60 && (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Precisa de mais estudo. Revise os materiais e tente novamente.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/simulados")}>Ver Outros Simulados</Button>
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  Ir para Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with timer and progress */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">{simulado.title}</h1>
              <p className="text-sm text-gray-600">
                Questão {currentQuestion + 1} de {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-1 text-red-500" />
                <span className={timeLeft < 300 ? "text-red-500 font-semibold" : ""}>{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm">
                Respondidas: {answeredQuestions}/{questions.length}
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Questão {currentQuestion + 1}: {questions[currentQuestion]?.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[questions[currentQuestion]?.id] || ""}
              onValueChange={(value) => handleAnswerChange(questions[currentQuestion]?.id, value)}
              className="space-y-4"
            >
              {["a", "b", "c", "d", "e"].map((option) => {
                const optionText = questions[currentQuestion]?.[`option_${option}` as keyof Question] as string
                if (!optionText) return null

                return (
                  <div key={option} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-2">{option.toUpperCase()})</span>
                      {optionText}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            Anterior
          </Button>

          <div className="flex gap-2">
            {currentQuestion < questions.length - 1 ? (
              <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>Próxima</Button>
            ) : (
              <Button
                onClick={handleFinishSimulado}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Finalizando..." : "Finalizar Simulado"}
              </Button>
            )}
          </div>
        </div>

        {/* Question navigator */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Navegação Rápida</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant={
                    currentQuestion === index ? "default" : answers[questions[index]?.id] ? "secondary" : "outline"
                  }
                  size="sm"
                  onClick={() => setCurrentQuestion(index)}
                  className="w-8 h-8 p-0"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
