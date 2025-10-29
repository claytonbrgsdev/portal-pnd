import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calendar, Users, MapPin, FileText, Clock, Target, Award, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function SobrePage() {
  const cronograma = [
    { evento: "Período de Isenção", data: "30/06 a 04/07/2025", status: "concluido" },
    { evento: "Inscrições", data: "14/07 a 25/07/2025", status: "ativo" },
    { evento: "Pagamento da Taxa", data: "14/07 a 26/07/2025", status: "pendente" },
    { evento: "Cartão de Confirmação", data: "Setembro/2025", status: "pendente" },
    { evento: "Aplicação da Prova", data: "26/10/2025", status: "pendente" },
    { evento: "Gabarito Preliminar", data: "27/10/2025", status: "pendente" },
    { evento: "Resultado Final", data: "Dezembro/2025", status: "pendente" },
  ]

  const estruturaProva = [
    {
      componente: "Formação Geral Docente",
      questoes: "30 objetivas + 1 discursiva",
      peso: "25%",
      conteudo: "Fundamentos pedagógicos, didática, legislação educacional",
    },
    {
      componente: "Conhecimentos Específicos",
      questoes: "50 objetivas",
      peso: "75%",
      conteudo: "Conteúdos específicos da área de licenciatura escolhida",
    },
  ]

  const beneficios = [
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: "Padronização Nacional",
      description: "Uma única prova aceita em concursos de todo o Brasil, reduzindo custos e burocracia.",
    },
    {
      icon: <Award className="w-6 h-6 text-green-600" />,
      title: "Qualidade Garantida",
      description: "Avaliação padronizada que garante qualidade no recrutamento de professores.",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
      title: "Transparência",
      description: "Maior transparência e equidade para todos os candidatos à carreira docente.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-blue-500 text-white mb-4">Edital nº 72/2025</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">O que é a Prova Nacional Docente?</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              A PND é uma iniciativa inédita no Brasil que unifica a avaliação de professores para ingresso na carreira
              pública, servindo como critério principal ou complementar em seleções públicas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <FileText className="w-5 h-5 mr-2" />
                Baixar Edital Completo
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Ver Cronograma
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Quick Summary */}
        <Card className="mb-12 border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Resumo Rápido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">26/10/2025</div>
                <div className="text-sm text-gray-600">Data da Prova</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">80 + 1</div>
                <div className="text-sm text-gray-600">Questões Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">5h30min</div>
                <div className="text-sm text-gray-600">Duração</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">Nacional</div>
                <div className="text-sm text-gray-600">Abrangência</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="lg:col-span-2 space-y-8">

  {/* Quem Somos */}
  <Card>
    <CardHeader>
      <CardTitle>Quem Somos</CardTitle>
      <CardDescription>Conheça o time e a proposta do Portal PND</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-gray-700">
        Somos um time apaixonado por educação, com carreiras marcadas pelo comprometimento com a formação inicial e continuada de professores em seus diferentes níveis. Reunimos uma equipe multidisciplinar com mais de 15 anos de experiência nos setores público e privado, atuando da educação básica ao ensino superior — da sala de aula da segunda fase do fundamental ao doutorado.
      </p>
      <p className="text-gray-700">
        Nossa equipe é formada por profissionais de diferentes áreas do conhecimento: História, Ciências Sociais, Biologia e Psicologia. Essa diversidade e ampla experiência acumulada ao longo dos anos proporcionam uma visão abrangente do cenário educacional, aliando vivência prática e expertise para oferecer soluções voltadas aos desafios e potencialidades da formação docente inicial e continuada.
      </p>
      <p className="text-gray-700">
        Aqui no portal, apresentamos uma metodologia que combina análise de dados com leitura crítica dos marcos curriculares, oferecendo conteúdos inovadores para a preparação à nova Prova Nacional Docente (PND). Nossa abordagem parte de uma análise profunda das diretrizes curriculares dos cursos de licenciatura, da BNCC e das edições anteriores do Enade, utilizando técnicas avançadas de análise de conteúdo e modelagem de tópicos para apoiar tanto o desenvolvimento profissional de quem já atua na educação quanto de quem pretende ingressar na carreira docente.
      </p>
    </CardContent>
  </Card>
            {/* Objetivos */}
            <Card>
              <CardHeader>
                <CardTitle>Objetivos da PND</CardTitle>
                <CardDescription>Por que a Prova Nacional Docente foi criada?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  A PND foi criada pelo Inep/MEC como uma avaliação unificada para transformar a forma de seleção de
                  professores nas redes de ensino públicas. Seus resultados servirão de referência em concursos e
                  processos seletivos em todo país, valorizando a formação docente e qualificando as contratações em
                  larga escala.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {beneficios.map((beneficio, index) => (
                    <div key={index} className="text-center p-4 border rounded-lg">
                      <div className="mx-auto mb-3">{beneficio.icon}</div>
                      <h4 className="font-semibold mb-2">{beneficio.title}</h4>
                      <p className="text-sm text-gray-600">{beneficio.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quem pode participar */}
            <Card>
              <CardHeader>
                <CardTitle>Quem pode participar?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Inscrição Automática (Gratuita)</h4>
                    <p className="text-green-700 text-sm">
                      Estudantes concluintes de cursos de licenciatura avaliados no Enade 2025 são inscritos
                      automaticamente, com isenção de taxa.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">📝 Inscrição Voluntária</h4>
                    <p className="text-blue-700 text-sm">
                      Demais interessados com formação adequada que queiram utilizar a nota da PND em concursos públicos
                      futuros podem se inscrever voluntariamente.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estrutura da Prova */}
            <Card>
              <CardHeader>
                <CardTitle>Estrutura da Prova</CardTitle>
                <CardDescription>Como será organizada a PND 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estruturaProva.map((componente, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{componente.componente}</h4>
                        <Badge variant="outline">{componente.peso}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Questões:</strong> {componente.questoes}
                      </div>
                      <p className="text-sm text-gray-700">{componente.conteudo}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Importante:</strong> A prova será aplicada em 26 de outubro de 2025, turno da tarde,
                    simultaneamente em todos os estados e DF, seguindo o padrão do Enade.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Como será calculada minha nota da PND?</AccordionTrigger>
                    <AccordionContent>
                      A nota da PND será calculada considerando o desempenho nas questões objetivas e discursivas, com
                      pesos específicos para cada componente. O cálculo seguirá metodologia baseada na Teoria de
                      Resposta ao Item (TRI), similar ao Enade.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>A PND substitui os concursos públicos tradicionais?</AccordionTrigger>
                    <AccordionContent>
                      Não. A PND não substitui os concursos, mas serve como uma avaliação padronizada que pode ser
                      utilizada pelos entes federativos como critério principal ou complementar em suas seleções de
                      professores.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Posso usar a nota da PND em qualquer concurso?</AccordionTrigger>
                    <AccordionContent>
                      A utilização da nota da PND dependerá da adesão de cada estado, município ou instituição. Cada
                      ente federativo decidirá se e como utilizará os resultados da PND em seus processos seletivos.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Qual a validade da nota da PND?</AccordionTrigger>
                    <AccordionContent>
                      A validade da nota será definida pelos entes que aderirem à PND. Recomenda-se consultar os editais
                      específicos de cada concurso para verificar o período de validade aceito.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cronograma */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Cronograma 2025
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cronograma.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium">{item.evento}</div>
                        <div className="text-gray-500">{item.data}</div>
                      </div>
                      <Badge
                        variant={
                          item.status === "concluido"
                            ? "default"
                            : item.status === "ativo"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {item.status === "concluido" ? "✓" : item.status === "ativo" ? "Ativo" : "Em breve"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Adesão Nacional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">27</div>
                    <div className="text-sm text-gray-600">Estados + DF participantes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">1000+</div>
                    <div className="text-sm text-gray-600">Municípios interessados</div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    A adesão à PND tem sido expressiva em todo o país, demonstrando o interesse dos entes federativos na
                    padronização da seleção docente.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Links Úteis */}
            <Card>
              <CardHeader>
                <CardTitle>Links Úteis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="https://www.gov.br/inep/pt-br" target="_blank" rel="noopener noreferrer">
                    <MapPin className="w-4 h-4 mr-2" />
                    Site Oficial do INEP
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/simulados">
                    <FileText className="w-4 h-4 mr-2" />
                    Fazer Simulados
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/materiais">
                    <FileText className="w-4 h-4 mr-2" />
                    Materiais de Estudo
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/duvidas">
                    <FileText className="w-4 h-4 mr-2" />
                    Tire suas Dúvidas
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
