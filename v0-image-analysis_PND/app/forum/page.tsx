import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { MessageCircle, Users, Search, Pin, TrendingUp, Clock, Eye } from "lucide-react"
import Link from "next/link"

const categorias = [
  {
    id: 1,
    name: "Edital e Regras",
    description: "Discussões sobre o edital da PND e regulamentações",
    topics: 45,
    posts: 234,
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 2,
    name: "Formação Geral",
    description: "Fundamentos pedagógicos e didática",
    topics: 128,
    posts: 892,
    color: "bg-green-100 text-green-800",
  },
  {
    id: 3,
    name: "Conhecimentos Específicos",
    description: "Discussões por área de conhecimento",
    topics: 89,
    posts: 567,
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: 4,
    name: "Carreira Docente",
    description: "Experiências e dicas sobre a profissão",
    topics: 67,
    posts: 423,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 5,
    name: "Estratégias de Estudo",
    description: "Métodos e cronogramas de preparação",
    topics: 156,
    posts: 1024,
    color: "bg-red-100 text-red-800",
  },
]

const topicosRecentes = [
  {
    id: 1,
    title: "Dúvidas sobre inscrição na PND - Prazo final!",
    author: "Maria Silva",
    authorAvatar: "MS",
    category: "Edital e Regras",
    replies: 23,
    views: 456,
    lastActivity: "2 horas atrás",
    isPinned: true,
    isHot: true,
  },
  {
    id: 2,
    title: "Qual bibliografia vocês estão usando para Matemática?",
    author: "João Santos",
    authorAvatar: "JS",
    category: "Conhecimentos Específicos",
    replies: 15,
    views: 234,
    lastActivity: "4 horas atrás",
    isPinned: false,
    isHot: true,
  },
  {
    id: 3,
    title: "Como conciliar trabalho e estudos para a PND?",
    author: "Ana Costa",
    authorAvatar: "AC",
    category: "Estratégias de Estudo",
    replies: 31,
    views: 678,
    lastActivity: "6 horas atrás",
    isPinned: false,
    isHot: false,
  },
  {
    id: 4,
    title: "Experiência: Minha aprovação em concurso de professor",
    author: "Carlos Lima",
    authorAvatar: "CL",
    category: "Carreira Docente",
    replies: 42,
    views: 892,
    lastActivity: "8 horas atrás",
    isPinned: false,
    isHot: false,
  },
  {
    id: 5,
    title: "Dicas para a prova discursiva - Compartilhem suas estratégias",
    author: "Lucia Ferreira",
    authorAvatar: "LF",
    category: "Formação Geral",
    replies: 18,
    views: 345,
    lastActivity: "12 horas atrás",
    isPinned: false,
    isHot: false,
  },
]

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Fórum & Comunidade PND</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tire dúvidas e aprenda junto com outros futuros docentes. Nenhuma dúvida é boba – estamos juntos para
              aprender!
            </p>
          </div>

          {/* Search and Stats */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Buscar discussões..." className="pl-10" />
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>2.847 membros</span>
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1" />
                <span>485 tópicos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorias</CardTitle>
                <CardDescription>Escolha um tópico para discussão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {categorias.map((categoria) => (
                  <Link key={categoria.id} href={`/forum/categoria/${categoria.id}`}>
                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={categoria.color}>{categoria.name}</Badge>
                        <span className="text-xs text-gray-500">{categoria.topics} tópicos</span>
                      </div>
                      <p className="text-sm text-gray-600">{categoria.description}</p>
                      <div className="text-xs text-gray-500 mt-1">{categoria.posts} posts</div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Novo Tópico
                </Button>
                <Button variant="outline" className="w-full">
                  Minhas Discussões
                </Button>
                <Button variant="outline" className="w-full">
                  Tópicos Salvos
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Pinned Topics */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Pin className="w-5 h-5 mr-2 text-blue-600" />
                  Tópicos Fixados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topicosRecentes
                    .filter((t) => t.isPinned)
                    .map((topico) => (
                      <div key={topico.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Pin className="w-4 h-4 text-blue-600" />
                              <Badge variant="outline" className="text-xs">
                                {topico.category}
                              </Badge>
                              {topico.isHot && (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Hot
                                </Badge>
                              )}
                            </div>
                            <Link href={`/forum/topico/${topico.id}`}>
                              <h3 className="font-semibold text-blue-900 hover:text-blue-700 cursor-pointer">
                                {topico.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Avatar className="w-6 h-6 mr-2">
                                  <AvatarFallback className="text-xs">{topico.authorAvatar}</AvatarFallback>
                                </Avatar>
                                {topico.author}
                              </div>
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {topico.replies}
                              </div>
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {topico.views}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {topico.lastActivity}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Discussões Recentes</CardTitle>
                <CardDescription>Últimas atividades da comunidade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topicosRecentes
                    .filter((t) => !t.isPinned)
                    .map((topico) => (
                      <div key={topico.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {topico.category}
                              </Badge>
                              {topico.isHot && (
                                <Badge className="bg-red-100 text-red-800 text-xs">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Hot
                                </Badge>
                              )}
                            </div>
                            <Link href={`/forum/topico/${topico.id}`}>
                              <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer mb-2">
                                {topico.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Avatar className="w-6 h-6 mr-2">
                                  <AvatarFallback className="text-xs">{topico.authorAvatar}</AvatarFallback>
                                </Avatar>
                                {topico.author}
                              </div>
                              <div className="flex items-center">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {topico.replies} respostas
                              </div>
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {topico.views} visualizações
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {topico.lastActivity}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
