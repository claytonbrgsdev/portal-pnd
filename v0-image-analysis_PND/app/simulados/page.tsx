import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSimulados } from "@/lib/simulados"
import { Clock, BookOpen, Trophy, Lock } from "lucide-react"
import Link from "next/link"

export default async function SimuladosPage() {
  const simulados = await getSimulados()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Simulados PND 2025</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pronto para o desafio? Faça um simulado agora e veja como você se sairia na PND! Nossos simulados são
              elaborados por professores experientes, seguindo o perfil da prova real.
            </p>
          </div>
        </div>
      </div>

      {/* Simulados Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulados.map((simulado) => (
            <Card key={simulado.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{simulado.title}</CardTitle>
                    <CardDescription className="text-sm">{simulado.description}</CardDescription>
                  </div>
                  {simulado.is_premium && (
                    <Badge variant="secondary" className="ml-2">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {simulado.total_questions} questões
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {simulado.duration_minutes} min
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {simulado.subject_area}
                  </Badge>
                  <Badge
                    variant={
                      simulado.difficulty_level === "Fácil"
                        ? "default"
                        : simulado.difficulty_level === "Médio"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {simulado.difficulty_level}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <Link href={`/simulados/${simulado.id}`}>
                  <Button className="w-full">
                    <Trophy className="w-4 h-4 mr-2" />
                    Iniciar Simulado
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {simulados.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum simulado disponível</h3>
            <p className="text-gray-600">Novos simulados serão adicionados em breve. Volte mais tarde!</p>
          </div>
        )}
      </div>
    </div>
  )
}
