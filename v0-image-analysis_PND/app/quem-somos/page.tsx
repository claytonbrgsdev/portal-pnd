import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function QuemSomosPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Quem Somos</CardTitle>
            <CardDescription>
              Conheça o time e a proposta do Portal PND
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 text-lg leading-relaxed">
            <p>
              Somos um time apaixonado por educação, com carreiras marcadas pelo comprometimento com a formação inicial e continuada de professores em seus diferentes níveis. Reunimos uma equipe multidisciplinar com mais de 15 anos de experiência nos setores público e privado, atuando da educação básica ao ensino superior — da sala de aula da segunda fase do fundamental ao doutorado.
            </p>
            <p>
              Nossa equipe é formada por profissionais de diferentes áreas do conhecimento: História, Ciências Sociais, Biologia e Psicologia. Essa diversidade e ampla experiência acumulada ao longo dos anos proporcionam uma visão abrangente do cenário educacional, aliando vivência prática e expertise para oferecer soluções voltadas aos desafios e potencialidades da formação docente inicial e continuada.
            </p>
            <p>
              Aqui no portal, apresentamos uma metodologia que combina análise de dados com leitura crítica dos marcos curriculares, oferecendo conteúdos inovadores para a preparação à nova Prova Nacional Docente (PND). Nossa abordagem parte de uma análise profunda das diretrizes curriculares dos cursos de licenciatura, da BNCC e das edições anteriores do Enade, utilizando técnicas avançadas de análise de conteúdo e modelagem de tópicos para apoiar tanto o desenvolvimento profissional de quem já atua na educação quanto de quem pretende ingressar na carreira docente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
