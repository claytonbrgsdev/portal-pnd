import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Portal PND</span>
            </div>
            <p className="text-gray-400 text-sm">
              Sua plataforma completa de preparação para a Prova Nacional Docente. Transforme sua vocação em aprovação.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/sobre" className="hover:text-white transition-colors">
                  Sobre a PND
                </Link>
              </li>
              <li>
                <Link href="/simulados" className="hover:text-white transition-colors">
                  Simulados
                </Link>
              </li>
              <li>
                <Link href="/materiais" className="hover:text-white transition-colors">
                  Materiais de Estudo
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-white transition-colors">
                  Fórum
                </Link>
              </li>
              <li>
                <Link href="/duvidas" className="hover:text-white transition-colors">
                  Central de Dúvidas
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/premium" className="hover:text-white transition-colors">
                  Planos Premium
                </Link>
              </li>
              <li>
                <Link href="/cronograma" className="hover:text-white transition-colors">
                  Cronograma PND
                </Link>
              </li>
              <li>
                <Link href="/edital" className="hover:text-white transition-colors">
                  Edital Completo
                </Link>
              </li>
              <li>
                <Link href="/resultados" className="hover:text-white transition-colors">
                  Resultados
                </Link>
              </li>
              <li>
                <Link href="/ajuda" className="hover:text-white transition-colors">
                  Central de Ajuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Receba dicas de estudo e novidades da PND direto no seu e-mail.
            </p>
            <div className="space-y-3">
              <Input placeholder="Seu melhor e-mail" className="bg-gray-800 border-gray-700 text-white" />
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Mail className="w-4 h-4 mr-2" />
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              <span>contato@portalpnd.com.br</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              <span>(11) 9999-9999</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>São Paulo, SP - Brasil</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div>
            <p>&copy; 2025 Portal PND. Todos os direitos reservados.</p>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacidade" className="hover:text-white transition-colors">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-white transition-colors">
              Termos de Uso
            </Link>
            <Link href="/contato" className="hover:text-white transition-colors">
              Contato
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
