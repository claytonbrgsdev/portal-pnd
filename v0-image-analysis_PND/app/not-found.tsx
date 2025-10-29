"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-blue-600">404</span>
          </div>
          <CardTitle className="text-gray-900">Página não encontrada</CardTitle>
          <CardDescription>
            A página que você está procurando não existe ou foi movida para outro local.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">O que você pode fazer:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Verificar se o endereço foi digitado corretamente</li>
              <li>• Usar a busca para encontrar o conteúdo</li>
              <li>• Voltar à página inicial</li>
              <li>• Navegar pelo menu principal</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Ir para Início
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/buscar">
                <Search className="w-4 h-4 mr-2" />
                Buscar Conteúdo
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => window.history.back()} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
