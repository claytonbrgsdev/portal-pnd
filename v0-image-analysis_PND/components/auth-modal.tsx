"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createUser, loginUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true)
    setMessage("")

    try {
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      if (!email || !password) {
        setMessage("Por favor, preencha todos os campos")
        setIsLoading(false)
        return
      }

      const result = await loginUser(email, password)

      if (result.success) {
        setMessage("Login realizado com sucesso!")
        // Store user session (in a real app, use proper session management)
        localStorage.setItem("user", JSON.stringify(result.user))
        setTimeout(() => {
          onClose()
          router.push("/dashboard")
        }, 1000)
      } else {
        setMessage(result.error || "Erro no login")
      }
    } catch (error) {
      console.error("Erro no login:", error)
      setMessage("Erro interno. Tente novamente.")
    }

    setIsLoading(false)
  }

  const handleRegister = async (formData: FormData) => {
    setIsLoading(true)
    setMessage("")

    try {
      const name = formData.get("name") as string
      const email = formData.get("email") as string
      const password = formData.get("password") as string

      if (!name || !email || !password) {
        setMessage("Por favor, preencha todos os campos")
        setIsLoading(false)
        return
      }

      const result = await createUser(email, name, password)

      if (result.success) {
        setMessage("Cadastro realizado com sucesso! Faça login para continuar.")
      } else {
        setMessage(result.error || "Erro no cadastro")
      }
    } catch (error) {
      console.error("Erro no cadastro:", error)
      setMessage("Erro interno. Tente novamente.")
    }

    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Acesse sua conta</DialogTitle>
          <DialogDescription>Entre ou cadastre-se para acessar todos os recursos do Portal PND</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <form action={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" name="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <Input id="login-password" name="password" type="password" placeholder="Sua senha" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form action={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Nome completo</Label>
                <Input id="register-name" name="name" type="text" placeholder="Seu nome completo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" name="email" type="email" placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Senha</Label>
                <Input id="register-password" name="password" type="password" placeholder="Crie uma senha" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {message && (
          <div
            className={`text-sm text-center p-2 rounded ${
              message.includes("sucesso") ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
            }`}
          >
            {message}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
