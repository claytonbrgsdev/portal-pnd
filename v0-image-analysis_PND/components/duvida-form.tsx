"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { submitDuvida } from "@/lib/duvidas"
import { useRouter } from "next/navigation"
import { Loader2, Send, CheckCircle } from "lucide-react"

export function DuvidaForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    question: "",
  })
  const router = useRouter()

  const categories = [
    "Edital e Inscrição",
    "Conteúdo da Prova",
    "Legislação Educacional",
    "Didática e Pedagogia",
    "Carreira Docente",
    "Metodologias de Ensino",
    "Avaliação",
    "Tecnologia na Educação",
    "Inclusão e Diversidade",
    "Outros",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Mock user ID for demo purposes
      const userId = 1
      const result = await submitDuvida(userId, formData.subject, formData.category, formData.question)

      if (result.success) {
        setIsSubmitted(true)
        setTimeout(() => {
          router.push("/duvidas")
        }, 2000)
      }
    } catch (error) {
      console.error("Erro ao enviar dúvida:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (isSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-900 mb-2">Dúvida Enviada com Sucesso!</h3>
          <p className="text-green-700 mb-4">
            Sua dúvida foi recebida e será respondida por nossos especialistas em até 24 horas.
          </p>
          <p className="text-sm text-green-600">Redirecionando para a página de dúvidas...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subject">Assunto da Dúvida *</Label>
        <Input
          id="subject"
          placeholder="Ex: Como calcular a nota da PND?"
          value={formData.subject}
          onChange={(e) => handleInputChange("subject", e.target.value)}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria *</Label>
        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="question">Sua Dúvida *</Label>
        <Textarea
          id="question"
          placeholder="Descreva sua dúvida com o máximo de detalhes possível. Inclua contexto, exemplos e o que você já tentou estudar sobre o assunto..."
          value={formData.question}
          onChange={(e) => handleInputChange("question", e.target.value)}
          required
          disabled={isSubmitting}
          rows={6}
          className="resize-none"
        />
        <p className="text-sm text-gray-500">Mínimo de 50 caracteres para uma resposta mais precisa</p>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting || formData.question.length < 50} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar Dúvida
            </>
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Cancelar
        </Button>
      </div>

      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
        <p className="font-medium mb-2">📝 Lembre-se:</p>
        <ul className="space-y-1">
          <li>• Seja específico sobre sua dúvida</li>
          <li>• Inclua exemplos quando possível</li>
          <li>• Mencione o que já estudou sobre o assunto</li>
          <li>• Nossa equipe responderá em até 24 horas</li>
        </ul>
      </div>
    </form>
  )
}
