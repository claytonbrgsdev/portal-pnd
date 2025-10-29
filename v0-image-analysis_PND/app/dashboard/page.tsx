import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getUserStats } from "@/lib/auth"
import { Trophy, BookOpen, Target, Calendar, TrendingUp, Award, Clock, Users } from "lucide-react"
import Link from "next/link"

// Mock user ID - in a real app, get from session
const MOCK_USER_ID = 1

export default async function DashboardPage() {
  const stats = await getUserStats(MOCK_USER_ID)

  // Calculate days until PND
  const pndDate = new Date("2025-10-26")
  const today = new Date()
  const daysUntilPND = Math.ceil((pndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Olá, Professor! 👋</h1>
              <p className="text-gray-600 mt-1">
                Faltam <span className="font-semibold text-blue-600">{daysUntilPND} dias</span> para a PND – continue
                firme nos estudos!
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Próxima meta</div>
              <div className="text-lg font-semibold text-blue-600">Simulado semanal</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Simulados Completos</CardTitle>
              <Trophy className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.simuladosCompletos}</div>
              <p className="text-xs text-muted-foreground">+2 desde a semana passada</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média de Notas</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mediaNotas}%</div>
              <p className="text-xs text-muted-foreground">Meta: 80% para aprovação</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ranking Nacional</CardTitle>
              <Award className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{stats.ranking}</div>
              <p className="text-xs text-muted-foreground">Entre todos os usuários</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dias até PND</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysUntilPND}</div>
              <p className="text-xs text-muted-foreground">26 de outubro de 2025</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Seu Progresso
                </CardTitle>
                <CardDescription>Acompanhe sua evolução nos estudos para a PND</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Formação Geral Docente</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Conhecimentos Específicos</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Questões Discursivas</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Simulado Geral PND #3 concluído</p>
                      <p className="text-xs text-gray-500">Nota: 78% • Há 2 dias</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Material "Legislação Educacional" estudado</p>
                      <p className="text-xs text-gray-500">Há 3 dias</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Participação no fórum "Dúvidas sobre Didática"</p>
                      <p className="text-xs text-gray-500">Há 5 dias</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Continue seus estudos de onde parou</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/simulados">
                  <Button className="w-full justify-start">
                    <Trophy className="w-4 h-4 mr-2" />
                    Fazer Simulado
                  </Button>
                </Link>
                <Link href="/materiais">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Ver Materiais
                  </Button>
                </Link>
                <Link href="/forum">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Acessar Fórum
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Motivação do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="text-sm italic text-gray-600 border-l-4 border-blue-500 pl-4">
                  "Ensinar não é transferir conhecimento, mas criar as possibilidades para a sua própria produção ou a
                  sua construção."
                  <footer className="text-xs mt-2 text-gray-500">— Paulo Freire</footer>
                </blockquote>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">Live: Dicas para Redação</p>
                    <p className="text-xs text-gray-500">Amanhã às 19h</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Simulado Nacional</p>
                    <p className="text-xs text-gray-500">Sábado às 14h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
