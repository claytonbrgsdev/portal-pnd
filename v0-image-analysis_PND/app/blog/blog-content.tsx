import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, ArrowRight, Search } from "lucide-react"
import Link from "next/link"

// Static mock data - no async operations
const BLOG_POSTS = [
  {
    id: 1,
    title: "Como se preparar para a PND 2025",
    excerpt:
      "Dicas essenciais para uma preparação eficiente para a Prova Nacional Docente. Descubra estratégias de estudo, cronograma ideal e materiais recomendados.",
    content: "Conteúdo completo do artigo sobre preparação para a PND...",
    author: "Equipe Portal PND",
    created_at: new Date().toISOString(),
    category: "Preparação",
    tags: ["PND", "Estudo", "Dicas"],
    featured_image: "/placeholder.svg?height=200&width=400",
    views: 1250,
    read_time: 8,
  },
  {
    id: 2,
    title: "Cronograma oficial da PND 2025",
    excerpt:
      "Confira todas as datas importantes da Prova Nacional Docente e não perca nenhum prazo crucial para sua inscrição e preparação.",
    content: "Cronograma detalhado com todas as datas importantes...",
    author: "Redação Portal PND",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    category: "Notícias",
    tags: ["PND", "Cronograma", "INEP"],
    featured_image: "/placeholder.svg?height=200&width=400",
    views: 890,
    read_time: 6,
  },
  {
    id: 3,
    title: "Estrutura da Prova Nacional Docente",
    excerpt:
      "Entenda como será organizada a PND, quais disciplinas serão cobradas e como se preparar para cada área de conhecimento.",
    content: "Detalhamento completo da estrutura da prova...",
    author: "Prof. Maria Silva",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    category: "Educação",
    tags: ["PND", "Estrutura", "Disciplinas"],
    featured_image: "/placeholder.svg?height=200&width=400",
    views: 675,
    read_time: 10,
  },
  {
    id: 4,
    title: "Dicas de estudo para professores iniciantes",
    excerpt: "Estratégias específicas para quem está começando a carreira docente e quer se destacar na PND.",
    content: "Guia completo para professores iniciantes...",
    author: "Prof. João Santos",
    created_at: new Date(Date.now() - 259200000).toISOString(),
    category: "Carreira",
    tags: ["Iniciantes", "Carreira", "Estudo"],
    featured_image: "/placeholder.svg?height=200&width=400",
    views: 432,
    read_time: 7,
  },
  {
    id: 5,
    title: "Simulados: a chave para o sucesso na PND",
    excerpt:
      "Por que fazer simulados é fundamental para sua aprovação e como aproveitar ao máximo essa ferramenta de estudo.",
    content: "Estratégias para usar simulados de forma eficiente...",
    author: "Equipe Pedagógica",
    created_at: new Date(Date.now() - 345600000).toISOString(),
    category: "Preparação",
    tags: ["Simulados", "Estratégia", "Preparação"],
    featured_image: "/placeholder.svg?height=200&width=400",
    views: 1100,
    read_time: 9,
  },
  {
    id: 6,
    title: "Legislação educacional na PND",
    excerpt: "Principais leis e diretrizes que você precisa conhecer para a Prova Nacional Docente.",
    content: "Guia completo sobre legislação educacional...",
    author: "Prof. Ana Costa",
    created_at: new Date(Date.now() - 432000000).toISOString(),
    category: "Legislação",
    tags: ["Legislação", "LDB", "Diretrizes"],
    featured_image: "/placeholder.svg?height=200&width=400",
    views: 567,
    read_time: 12,
  },
]

const CATEGORIES = [
  { category: "Preparação", count: 15 },
  { category: "Notícias", count: 12 },
  { category: "Educação", count: 8 },
  { category: "Carreira", count: 6 },
  { category: "Legislação", count: 5 },
  { category: "Dicas", count: 10 },
]

export default function BlogContent() {
  // No async operations - just static data
  const posts = BLOG_POSTS
  const categories = CATEGORIES

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Portal PND</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fique por dentro das últimas notícias, dicas de estudo e informações sobre a Prova Nacional Docente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid gap-8">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={post.featured_image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <CardHeader className="p-0 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{post.category}</Badge>
                          <div className="flex items-center text-sm text-gray-500 gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(post.created_at).toLocaleDateString("pt-BR")}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {post.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </div>
                          </div>
                        </div>
                        <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                          <Link href={`/blog/${post.id}`}>{post.title}</Link>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/blog/${post.id}`} className="flex items-center gap-1">
                              Ler mais
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Buscar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar artigos..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <Link
                        href={`/blog?categoria=${encodeURIComponent(category.category)}`}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {category.category}
                      </Link>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Newsletter PND</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 mb-4 text-sm">
                  Receba as últimas notícias e dicas de preparação diretamente no seu email.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Seu email"
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Inscrever-se</Button>
                </div>
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posts Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="border-b border-gray-200 last:border-b-0 pb-3 last:pb-0">
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        {post.views} visualizações
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
