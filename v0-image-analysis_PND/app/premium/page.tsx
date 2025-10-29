import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Crown, Zap, Users, BookOpen, MessageCircle, Trophy } from "lucide-react"

export default function PremiumPage() {
  const planos = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Para começar sua preparação",
      features: [
        "3 simulados básicos",
        "Materiais gratuitos limitados",
        "Acesso ao fórum",
        "3 dúvidas por mês",
        "Ranking público",
      ],
      limitations: ["Simulados limitados", "Sem correção personalizada", "Sem suporte prioritário"],
      buttonText: "Plano Atual",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Premium",
      price: "R$ 29,90",
      period: "/mês",
      description: "Acelere sua aprovação",
      features: [
        "Simulados ilimitados",
        "Todos os materiais de estudo",
        "Correção de redação personalizada",
        "Dúvidas ilimitadas com resposta em 24h",
        "Fórum VIP exclusivo",
        "Ranking detalhado com análises",
        "Certificados de desempenho",
        "Suporte prioritário",
        "Acesso antecipado a novos conteúdos",
      ],
      limitations: [],
      buttonText: "Assinar Premium",
      buttonVariant: "default" as const,
      popular: true,
      discount: "50% OFF no primeiro mês",
    },
    {
      name: "Premium Anual",
      price: "R$ 19,90",
      period: "/mês",
      originalPrice: "R$ 29,90",
      description: "Melhor custo-benefício",
      features: [
        "Todos os benefícios Premium",
        "2 meses grátis",
        "Mentoria individual mensal",
        "Simulados exclusivos",
        "Acesso vitalício a materiais",
        "Garantia de 30 dias",
      ],
      limitations: [],
      buttonText: "Assinar Anual",
      buttonVariant: "default" as const,
      popular: false,
      savings: "Economize R$ 120/ano",
    },
  ]

  const beneficiosDetalhados = [
    {
      icon: <Trophy className="w-8 h-8 text-blue-600" />,
      title: "Simulados Ilimitados",
      description: "Acesso a todos os simulados, incluindo exclusivos para Premium, com correção detalhada e ranking.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      title: "Biblioteca Completa",
      description: "Todos os PDFs, videoaulas, questões comentadas e materiais de apoio sem limitações.",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
      title: "Suporte Especializado",
      description: "Dúvidas ilimitadas respondidas por professores especialistas em até 24 horas.",
    },
    {
      icon: <Users className="w-8 h-8 text-yellow-600" />,
      title: "Comunidade VIP",
      description: "Acesso ao fórum exclusivo Premium com discussões avançadas e networking.",
    },
    {
      icon: <Star className="w-8 h-8 text-red-600" />,
      title: "Correção Personalizada",
      description: "Suas redações e questões discursivas corrigidas individualmente com feedback detalhado.",
    },
    {
      icon: <Zap className="w-8 h-8 text-indigo-600" />,
      title: "Recursos Exclusivos",
      description: "Acesso antecipado a novos conteúdos, certificados e ferramentas de estudo avançadas.",
    },
  ]

  const depoimentos = [
    {
      name: "Maria Santos",
      role: "Aprovada em 1º lugar",
      content: "O Premium foi essencial na minha aprovação. As correções personalizadas me ajudaram muito!",
      rating: 5,
    },
    {
      name: "João Silva",
      role: "Professor de Matemática",
      content: "Os simulados exclusivos e o suporte rápido fizeram toda a diferença na minha preparação.",
      rating: 5,
    },
    {
      name: "Ana Costa",
      role: "Licencianda em História",
      content: "Vale cada centavo! O conteúdo é muito completo e o atendimento é excelente.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 mr-2" />
            <Badge className="bg-yellow-400 text-yellow-900">Oferta Especial</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Seja Premium e acelere sua aprovação</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Acesso ilimitado a todos os nossos materiais, simulados exclusivos no padrão PND, fórum tira-dúvidas com
            respostas rápidas de especialistas e acompanhamento individual.
          </p>
          <div className="flex items-center justify-center gap-8 text-blue-100">
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <span>Garantia de 30 dias</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Escolha seu plano</h2>
          <p className="text-lg text-gray-600">Opções flexíveis para sua preparação na PND</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {planos.map((plano) => (
            <Card key={plano.name} className={`relative ${plano.popular ? "ring-2 ring-blue-500 scale-105" : ""}`}>
              {plano.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">Mais Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plano.name}</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold">{plano.price}</span>
                  <span className="text-gray-500">{plano.period}</span>
                  {plano.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">{plano.originalPrice}</span>
                  )}
                </div>
                <CardDescription>{plano.description}</CardDescription>
                {plano.discount && <Badge className="bg-green-100 text-green-800">{plano.discount}</Badge>}
                {plano.savings && <Badge className="bg-yellow-100 text-yellow-800">{plano.savings}</Badge>}
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plano.features.map((feature) => (
                    <div key={feature} className="flex items-center">
                      <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full" variant={plano.buttonVariant} size="lg">
                  {plano.buttonText}
                </Button>

                {plano.name === "Premium Anual" && (
                  <p className="text-xs text-center text-gray-500">
                    Cobrança anual de R$ 238,80 (equivale a R$ 19,90/mês)
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Benefits */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que escolher o Premium?</h2>
            <p className="text-lg text-gray-600">Recursos exclusivos para maximizar sua preparação</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beneficiosDetalhados.map((beneficio) => (
              <Card key={beneficio.title} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">{beneficio.icon}</div>
                  <CardTitle className="text-xl">{beneficio.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{beneficio.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">O que dizem nossos alunos Premium</h2>
            <p className="text-lg text-gray-600">Histórias reais de sucesso</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {depoimentos.map((depoimento) => (
              <Card key={depoimento.name}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(depoimento.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">"{depoimento.content}"</p>
                  <div>
                    <div className="font-semibold">{depoimento.name}</div>
                    <div className="text-sm text-gray-500">{depoimento.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
                <p className="text-gray-600">
                  Sim! Você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Como funciona a garantia de 30 dias?</h3>
                <p className="text-gray-600">
                  Se não ficar satisfeito nos primeiros 30 dias, devolvemos 100% do seu dinheiro, sem perguntas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Posso mudar de plano depois?</h3>
                <p className="text-gray-600">
                  Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para acelerar sua aprovação?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de futuros professores que já escolheram o Premium para conquistar seus sonhos.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Crown className="w-5 h-5 mr-2" />
            Assinar Premium Agora
          </Button>
          <p className="text-sm text-blue-200 mt-4">Oferta especial: 50% OFF no primeiro mês • Garantia de 30 dias</p>
        </div>
      </div>
    </div>
  )
}
