import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, Video, MessageCircle, BookOpen, Clock, User } from "lucide-react"
import Link from "next/link"

function SearchResults({ query }: { query: string }) {
  // Mock search results - in a real app, this would come from your search API
  const results = {
    materiais: [
      {
        id: 1,
        title: "Apostila de Formação Geral Docente",
        description: "Conteúdo completo sobre fundamentos pedagógicos e legislação educacional",
        type: "PDF",
        category: "Formação Geral",
        url: "/materiais/1",
      },
      {
        id: 2,
        title: "Videoaula: Metodologias Ativas",
        description: "Aprenda sobre metodologias ativas de ensino",
        type: "Video",
        category: "Didática",
        url: "/materiais/2",
      },
    ],
    posts: [
      {
        id: 1,
        title: "10 Dicas para Estudar para a PND",
        excerpt: "Estratégias eficazes para sua preparação na Prova Nacional Docente",
        author: "Prof. Maria Silva",
        date: "2025-01-15",
        url: "/blog/10-dicas-estudar-pnd",
      },
      {
        id: 2,
        title: "Edital da PND 2025: Principais Pontos",
        excerpt: "Resumo completo do edital da Prova Nacional Docente 2025",
        author: "Equipe Portal PND",
        date: "2025-01-10",
        url: "/blog/edital-pnd-2025",
      },
    ],
    forum: [
      {
        id: 1,
        title: "Dúvidas sobre inscrição na PND",
        category: "Edital e Regras",
        replies: 23,
        views: 456,
        url: "/forum/topico/1",
      },
      {
        id: 2,
        title: "Bibliografia para Matemática",
        category: "Conhecimentos Específicos",
        replies: 15,
        views: 234,
        url: "/forum/topico/2",
      },
    ],
    simulados: [
      {
        id: 1,
        title: "Simulado Geral PND #1",
        description: "Simulado completo com questões de todas as áreas",
        questions: 80,
        duration: 180,
        url: "/simulados/1",
      },
    ],
  }

  const totalResults = results.materiais.length + results.posts.length + results.forum.length + results.simulados.length

  if (!query) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Digite algo para buscar</h3>
        <p className="text-gray-600">Use a barra de pesquisa acima para encontrar conteúdo no Portal PND</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Resultados para "{query}" ({totalResults} encontrados)
        </h2>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="todos">Todos ({totalResults})</TabsTrigger>
          <TabsTrigger value="materiais">Materiais ({results.materiais.length})</TabsTrigger>
          <TabsTrigger value="blog">Blog ({results.posts.length})</TabsTrigger>
          <TabsTrigger value="forum">Fórum ({results.forum.length})</TabsTrigger>
          <TabsTrigger value="simulados">Simulados ({results.simulados.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          {/* All results mixed */}
          {results.materiais.map((item) => (
            <Card key={`material-${item.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === "PDF" ? (
                        <FileText className="w-4 h-4 text-red-500" />
                      ) : (
                        <Video className="w-4 h-4 text-blue-500" />
                      )}
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <Link href={item.url} className="hover:text-blue-600">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {results.posts.map((post) => (
            <Card key={`post-${post.id}`} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-green-500" />
                      <Badge variant="outline">Blog</Badge>
                    </div>
                    <Link href={post.url} className="hover:text-blue-600">
                      <h3 className="font-semibold mb-1">{post.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{post.excerpt}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <User className="w-3 h-3 mr-1" />
                      {post.author}
                      <Clock className="w-3 h-3 ml-3 mr-1" />
                      {new Date(post.date).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="materiais" className="space-y-4">
          {results.materiais.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === "PDF" ? (
                        <FileText className="w-4 h-4 text-red-500" />
                      ) : (
                        <Video className="w-4 h-4 text-blue-500" />
                      )}
                      <Badge variant="outline">{item.category}</Badge>
                      <Badge className="bg-blue-100 text-blue-800">{item.type}</Badge>
                    </div>
                    <Link href={item.url} className="hover:text-blue-600">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          {results.posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <Link href={post.url} className="hover:text-blue-600">
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                </Link>
                <p className="text-sm text-gray-600 mb-3">{post.excerpt}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <User className="w-3 h-3 mr-1" />
                  {post.author}
                  <Clock className="w-3 h-3 ml-3 mr-1" />
                  {new Date(post.date).toLocaleDateString("pt-BR")}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="forum" className="space-y-4">
          {results.forum.map((topic) => (
            <Card key={topic.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-purple-500" />
                      <Badge variant="outline">{topic.category}</Badge>
                    </div>
                    <Link href={topic.url} className="hover:text-blue-600">
                      <h3 className="font-semibold mb-1">{topic.title}</h3>
                    </Link>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{topic.replies} respostas</span>
                      <span>{topic.views} visualizações</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="simulados" className="space-y-4">
          {results.simulados.map((simulado) => (
            <Card key={simulado.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-green-500" />
                      <Badge variant="outline">Simulado</Badge>
                    </div>
                    <Link href={simulado.url} className="hover:text-blue-600">
                      <h3 className="font-semibold mb-1">{simulado.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{simulado.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{simulado.questions} questões</span>
                      <span>{simulado.duration} minutos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function BuscarPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || ""

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Buscar no Portal PND</h1>
          <div className="max-w-2xl">
            <form method="GET" className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                name="q"
                type="search"
                placeholder="Digite sua busca..."
                className="pl-12 pr-4 h-12 text-lg"
                defaultValue={query}
              />
              <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                Buscar
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Buscando...</p>
            </div>
          }
        >
          <SearchResults query={query} />
        </Suspense>
      </div>
    </div>
  )
}
