import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Video, BookOpen, Download, Lock, Search, Star } from "lucide-react"

const materiais = [
  {
    id: 1,
    title: "Apostila de Formação Geral Docente",
    description: "Conteúdo completo sobre fundamentos pedagógicos, didática e legislação educacional",
    type: "PDF",
    category: "Formação Geral",
    pages: 120,
    isPremium: false,
    isNew: true,
    rating: 4.8,
    downloads: 1250,
  },
  {
    id: 2,
    title: "Videoaula: Metodologias Ativas de Ensino",
    description: "Aprenda sobre as principais metodologias ativas e como aplicá-las em sala de aula",
    type: "Video",
    category: "Didática",
    duration: "45min",
    isPremium: true,
    isNew: false,
    rating: 4.9,
    downloads: 890,
  },
  {
    id: 3,
    title: "Questões Comentadas - BNCC",
    description: "50 questões sobre a Base Nacional Comum Curricular com explicações detalhadas",
    type: "Questões",
    category: "Legislação",
    questions: 50,
    isPremium: false,
    isNew: true,
    rating: 4.7,
    downloads: 2100,
  },
  {
    id: 4,
    title: "Lei de Diretrizes e Bases - LDB Comentada",
    description: "Análise completa da LDB 9394/96 com comentários e jurisprudência",
    type: "PDF",
    category: "Legislação",
    pages: 85,
    isPremium: true,
    isNew: false,
    rating: 4.6,
    downloads: 750,
  },
  {
    id: 5,
    title: "Psicologia da Educação - Resumo Executivo",
    description: "Principais teorias de aprendizagem e desenvolvimento cognitivo",
    type: "PDF",
    category: "Psicologia",
    pages: 60,
    isPremium: false,
    isNew: false,
    rating: 4.5,
    downloads: 980,
  },
  {
    id: 6,
    title: "Webinar: Avaliação na Educação Básica",
    description: "Estratégias e instrumentos de avaliação para diferentes níveis de ensino",
    type: "Video",
    category: "Avaliação",
    duration: "60min",
    isPremium: true,
    isNew: true,
    rating: 4.8,
    downloads: 420,
  },
]

export default function MateriaisPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="w-5 h-5" />
      case "Video":
        return <Video className="w-5 h-5" />
      case "Questões":
        return <BookOpen className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PDF":
        return "bg-red-100 text-red-800"
      case "Video":
        return "bg-blue-100 text-blue-800"
      case "Questões":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Biblioteca do Professor</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Acesse materiais selecionados para você dominar os conteúdos da PND – tudo em um só lugar
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Buscar materiais..." className="pl-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Tabs defaultValue="todos" className="mb-8">
          <TabsList className="grid w-full grid-cols-6 max-w-2xl mx-auto">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="pdf">PDFs</TabsTrigger>
            <TabsTrigger value="video">Vídeos</TabsTrigger>
            <TabsTrigger value="questoes">Questões</TabsTrigger>
            <TabsTrigger value="gratuito">Gratuito</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materiais.map((material) => (
                <Card key={material.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getIcon(material.type)}
                        <Badge className={getTypeColor(material.type)}>{material.type}</Badge>
                        {material.isNew && <Badge className="bg-green-100 text-green-800">Novo</Badge>}
                        {material.isPremium && (
                          <Badge variant="secondary">
                            <Lock className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{material.title}</CardTitle>
                    <CardDescription>{material.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {/* Material info */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {material.pages && `${material.pages} páginas`}
                          {material.duration && `${material.duration}`}
                          {material.questions && `${material.questions} questões`}
                        </span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span>{material.rating}</span>
                        </div>
                      </div>

                      {/* Category and downloads */}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {material.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{material.downloads} downloads</span>
                      </div>

                      {/* Action button */}
                      <Button className="w-full" variant={material.isPremium ? "secondary" : "default"}>
                        <Download className="w-4 h-4 mr-2" />
                        {material.isPremium ? "Assinar Premium" : "Baixar Grátis"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tab contents would filter the materials array */}
          <TabsContent value="pdf">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materiais
                .filter((m) => m.type === "PDF")
                .map((material) => (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow">
                    {/* Same card content as above */}
                    <CardHeader>
                      <CardTitle className="text-lg">{material.title}</CardTitle>
                      <CardDescription>{material.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        {material.isPremium ? "Assinar Premium" : "Baixar Grátis"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white mt-12">
          <CardContent className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">Quer acesso a todos os materiais?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Com a assinatura Premium, você tem acesso ilimitado a todos os PDFs, videoaulas, questões comentadas e
              muito mais. Acelere sua preparação!
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Assinar Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
