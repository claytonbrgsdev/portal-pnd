import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, ArrowLeft, Share2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Static blog post data
const BLOG_POSTS = [
  {
    id: 1,
    title: "Como se preparar para a PND 2025",
    excerpt:
      "Dicas essenciais para uma preparação eficiente para a Prova Nacional Docente. Descubra estratégias de estudo, cronograma ideal e materiais recomendados.",
    content: `
      <h2>Introdução</h2>
      <p>A Prova Nacional Docente (PND) representa uma oportunidade única para professores ingressarem na carreira pública. Com a aplicação prevista para 2025, é fundamental começar a preparação desde já.</p>
      
      <h2>Estratégias de Estudo</h2>
      <ul>
        <li><strong>Organize seu tempo:</strong> Crie um cronograma de estudos realista e consistente.</li>
        <li><strong>Conheça o edital:</strong> Estude detalhadamente todos os tópicos que serão cobrados.</li>
        <li><strong>Pratique com simulados:</strong> Faça simulados regularmente para testar seus conhecimentos.</li>
        <li><strong>Forme grupos de estudo:</strong> Compartilhe conhecimentos e tire dúvidas com outros candidatos.</li>
      </ul>
      
      <h2>Materiais Recomendados</h2>
      <p>Utilize materiais atualizados e específicos para a PND. Nosso portal oferece diversos recursos gratuitos e premium para sua preparação, incluindo:</p>
      <ul>
        <li>Simulados online com correção automática</li>
        <li>Apostilas atualizadas por área de conhecimento</li>
        <li>Videoaulas com professores especialistas</li>
        <li>Fórum de discussão com outros candidatos</li>
      </ul>
      
      <h2>Conclusão</h2>
      <p>A preparação adequada é a chave para o sucesso na PND. Dedique-se aos estudos, utilize todas as ferramentas disponíveis e mantenha-se motivado. Lembre-se: sua vocação para ensinar pode transformar vidas!</p>
    `,
    author: "Equipe Portal PND",
    created_at: new Date().toISOString(),
    category: "Preparação",
    tags: ["PND", "Estudo", "Dicas"],
    featured_image: "/placeholder.svg?height=400&width=800",
    views: 1250,
    read_time: 8,
  },
  // Add other posts as needed...
]

interface BlogPostPageProps {
  params: {
    id: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const postId = Number.parseInt(params.id)
  const post = BLOG_POSTS.find((p) => p.id === postId)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Blog
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              {/* Featured Image */}
              <img
                src={post.featured_image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-64 object-cover"
              />

              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
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
                      {post.views} visualizações
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl">{post.title}</CardTitle>
                <p className="text-lg text-gray-600 mt-2">{post.excerpt}</p>
              </CardHeader>

              <CardContent>
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
                  <span className="text-sm font-medium text-gray-700">Tags:</span>
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Share */}
                <div className="flex items-center justify-between mt-8 pt-8 border-t">
                  <div className="text-sm text-gray-600">Gostou do artigo? Compartilhe com outros candidatos!</div>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartilhar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sobre o Autor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{post.author}</div>
                    <div className="text-sm text-gray-600">Especialista em Educação</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Equipe especializada em preparação para concursos da área educacional.
                </p>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Posts Relacionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {BLOG_POSTS.filter((p) => p.id !== post.id)
                    .slice(0, 3)
                    .map((relatedPost) => (
                      <div key={relatedPost.id} className="border-b border-gray-200 last:border-b-0 pb-3 last:pb-0">
                        <Link
                          href={`/blog/${relatedPost.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {relatedPost.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Eye className="w-3 h-3" />
                          {relatedPost.views} visualizações
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
