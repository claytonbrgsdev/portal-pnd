import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getDuvidasFrequentes } from "@/lib/duvidas"
import { MessageCircle, HelpCircle, Clock, CheckCircle, Users } from "lucide-react"
import Link from "next/link"

export default async function DuvidasPage() {
  // This is a server component, so we can safely call async functions
  const duvidasFrequentes = await getDuvidasFrequentes()

  const categorias = [
    { name: "Edital e Inscrição", count: 15, icon: "📋" },
    { name: "Conteúdo da Prova", count: 23, icon: "📚" },
    { name: "Legislação Educacional", count: 18, icon: "⚖️" },
    { name: "Didática e Pedagogia", count: 12, icon: "🎓" },
    { name: "Carreira Docente", count: 8, icon: "👨‍🏫" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Central de Dúvidas</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Teve alguma dúvida durante os estudos? Nossos professores estão prontos para ajudar!
            </p>
          </div>

          <div className="flex justify-center">
            <Link href="/duvidas/nova">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <MessageCircle className="w-5 h-5 mr-2" />
                Enviar Nova Dúvida
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <HelpCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">1.247</div>
                <div className="text-sm text-gray-600">Dúvidas respondidas</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">24h</div>
                <div className="text-sm text-gray-600">Tempo médio de resposta</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-gray-600">Taxa de satisfação</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">15</div>
                <div className="text-sm text-gray-600">Professores especialistas</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorias</CardTitle>
                <CardDescription>Explore dúvidas por tema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {categorias.map((categoria) => (
                  <div
                    key={categoria.name}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{categoria.icon}</span>
                      <span className="font-medium">{categoria.name}</span>
                    </div>
                    <Badge variant="secondary">{categoria.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Como funciona?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 font-semibold text-xs">1</span>
                  </div>
                  <div>
                    <div className="font-medium">Envie sua dúvida</div>
                    <div className="text-gray-600">Descreva sua pergunta com detalhes</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 font-semibold text-xs">2</span>
                  </div>
                  <div>
                    <div className="font-medium">Professor responde</div>
                    <div className="text-gray-600">Em até 24h você recebe a resposta</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-blue-600 font-semibold text-xs">3</span>
                  </div>
                  <div>
                    <div className="font-medium">Notificação</div>
                    <div className="text-gray-600">Você recebe por e-mail e no portal</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Dúvidas Frequentes</CardTitle>
                <CardDescription>
                  Confira as perguntas mais comuns e suas respostas elaboradas por nossos especialistas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {duvidasFrequentes && duvidasFrequentes.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {duvidasFrequentes.map((duvida, index) => (
                      <AccordionItem key={duvida.id} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="mt-1">
                              {duvida.category}
                            </Badge>
                            <span className="font-medium">{duvida.subject}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-4 space-y-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Pergunta:</h4>
                              <p className="text-gray-700">{duvida.question}</p>
                            </div>
                            {duvida.answer && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Resposta:</h4>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <p className="text-gray-700">{duvida.answer}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-12">
                    <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma dúvida frequente ainda</h3>
                    <p className="text-gray-600 mb-4">Seja o primeiro a enviar uma dúvida e ajude outros estudantes!</p>
                    <Link href="/duvidas/nova">
                      <Button>Enviar Primeira Dúvida</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardContent className="text-center py-8">
                <h3 className="text-2xl font-bold mb-4">Não encontrou sua dúvida?</h3>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Nossos professores especialistas estão prontos para esclarecer qualquer questão sobre a PND, conteúdos
                  específicos ou carreira docente.
                </p>
                <Link href="/duvidas/nova">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Enviar Minha Dúvida
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
