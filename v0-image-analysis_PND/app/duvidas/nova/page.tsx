import { Suspense } from "react"
import { DuvidaForm } from "@/components/duvida-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Clock, CheckCircle } from "lucide-react"

export default function NovaDuvidaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Enviar Nova Dúvida</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descreva sua dúvida com detalhes e nossos professores especialistas responderão em até 24 horas.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Formulário de Dúvida
                  </CardTitle>
                  <CardDescription>Preencha todos os campos para que possamos ajudá-lo da melhor forma</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div className="p-8 text-center">Carregando formulário...</div>}>
                    <DuvidaForm />
                  </Suspense>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Processo de Resposta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    <div>
                      <div className="font-medium">Envio da Dúvida</div>
                      <div className="text-sm text-gray-600">Sua pergunta é recebida e categorizada</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">2</span>
                    </div>
                    <div>
                      <div className="font-medium">Análise Especializada</div>
                      <div className="text-sm text-gray-600">Professor especialista analisa sua dúvida</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">3</span>
                    </div>
                    <div>
                      <div className="font-medium">Resposta Detalhada</div>
                      <div className="text-sm text-gray-600">Você recebe uma resposta completa</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-green-600" />
                    <div>
                      <div className="font-semibold">Tempo de Resposta</div>
                      <div className="text-sm text-gray-600">Até 24 horas</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-semibold">Qualidade Garantida</div>
                      <div className="text-sm text-gray-600">Professores especialistas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Dica para uma boa pergunta:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Seja específico sobre sua dúvida</li>
                    <li>• Inclua o contexto da questão</li>
                    <li>• Mencione o que já tentou estudar</li>
                    <li>• Use exemplos quando possível</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
