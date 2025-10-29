"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Users,
  Trophy,
  MessageCircle,
  FileText,
  Play,
  Star,
  CheckCircle,
  ArrowRight,
  Calendar,
  Target,
  Award,
} from "lucide-react"
import Link from "next/link"
import { AuthModal } from "@/components/auth-modal"

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Calendar className="w-4 h-4 mr-2" />
            Prova em 26 de outubro de 2025
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Sua vocação ensinar,
            <span className="text-blue-600 block">nossa missão aprovar!</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Portal PND: informações, simulados e apoio completo para você conquistar sua carreira docente na Prova
            Nacional Docente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/simulados">
                <Play className="w-5 h-5 mr-2" />
                Fazer Simulado Gratuito
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/materiais">
                <FileText className="w-5 h-5 mr-2" />
                Baixar Guia de Estudos
              </Link>
            </Button>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Receba materiais gratuitos</h3>
            <div className="flex gap-2">
              <Input placeholder="Seu melhor e-mail" className="flex-1" />
              <Button>Cadastrar</Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Dicas de estudo, simulados e novidades da PND direto no seu e-mail
            </p>
          </div>
        </div>
      </section>

      {/* About PND Section */}
      <section id="sobre" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">O que é a Prova Nacional Docente?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A PND é uma iniciativa inédita no Brasil que unifica a avaliação de professores para ingresso na carreira
              pública, servindo como critério principal ou complementar em seleções públicas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Padronização Nacional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Uma única prova aceita em concursos de todo o Brasil, reduzindo custos e burocracia
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Award className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Qualidade Garantida</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Avaliação padronizada que garante qualidade no recrutamento de professores
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Transparência</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Maior transparência e equidade para todos os candidatos à carreira docente
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tudo que você precisa para ser aprovado</h2>
            <p className="text-lg text-gray-600">Ferramentas completas para sua preparação na Prova Nacional Docente</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Trophy className="w-10 h-10 text-blue-600 mb-3" />
                <CardTitle>Simulados Online</CardTitle>
                <CardDescription>Teste seus conhecimentos com simulados no nível da prova real</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Correção automática
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Rankings nacionais
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Questões comentadas
                  </li>
                </ul>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/simulados">Fazer Simulado</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-10 h-10 text-blue-600 mb-3" />
                <CardTitle>Fórum & Comunidade</CardTitle>
                <CardDescription>Tire dúvidas e aprenda junto com outros futuros docentes</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Discussões por disciplina
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Moderação especializada
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Networking profissional
                  </li>
                </ul>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/forum">Acessar Fórum</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageCircle className="w-10 h-10 text-blue-600 mb-3" />
                <CardTitle>Central de Dúvidas</CardTitle>
                <CardDescription>Perguntas respondidas por professores especialistas</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Resposta em 24h
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Professores experientes
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Base de conhecimento
                  </li>
                </ul>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/duvidas">Enviar Dúvida</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="w-10 h-10 text-blue-600 mb-3" />
                <CardTitle>Materiais de Estudo</CardTitle>
                <CardDescription>Biblioteca completa com apostilas, vídeos e questões</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    PDFs organizados
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Videoaulas didáticas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Questões resolvidas
                  </li>
                </ul>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/materiais">Ver Materiais</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Star className="w-10 h-10 text-blue-600 mb-3" />
                <CardTitle>Cursos Premium</CardTitle>
                <CardDescription>Preparação intensiva com correção personalizada</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Correção de redação
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Simulados exclusivos
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Mentoria individual
                  </li>
                </ul>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/premium">Ver Cursos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="w-10 h-10 text-blue-600 mb-3" />
                <CardTitle>Blog & Dicas</CardTitle>
                <CardDescription>Artigos, novidades e estratégias de estudo atualizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Dicas de especialistas
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Atualizações do edital
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Histórias de sucesso
                  </li>
                </ul>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/blog">Ler Blog</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Histórias de Sucesso</h2>
            <p className="text-lg text-gray-600">Veja como outros futuros professores estão se preparando conosco</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">MR</span>
                </div>
                <div>
                  <h4 className="font-semibold">Maria Rodrigues</h4>
                  <p className="text-sm text-gray-600">Licencianda em Matemática</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "Os simulados do Portal PND me ajudaram muito a entender o formato da prova. Consegui identificar meus
                pontos fracos e focar nos estudos. Recomendo!"
              </p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-semibold">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold">João Silva</h4>
                  <p className="text-sm text-gray-600">Professor de História</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "A comunidade é incrível! Sempre tem alguém disposto a ajudar. Os materiais são atualizados e a central
                de dúvidas é muito eficiente."
              </p>
              <div className="flex mt-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Você não está sozinho nessa jornada</h2>
          <p className="text-xl mb-8 opacity-90">
            Conte conosco para alcançar seu sonho de sala de aula! Transforme vidas através da educação começando pela
            sua aprovação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <Play className="w-5 h-5 mr-2" />
              Começar Agora - É Grátis
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white bg-white text-blue-600 hover:bg-blue-50 font-semibold"
              asChild
            >
              <Link href="/premium">
                <ArrowRight className="w-5 h-5 mr-2" />
                Ver Planos Premium
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}
