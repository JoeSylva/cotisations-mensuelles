"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, Mail } from "lucide-react"
import { useAuthContext } from "@/contexts/auth-context"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthContext()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Une erreur inconnue est survenue")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Carte avec ombre et sans bordure */}
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            {/* Logo et titres centrés */}
            <div className="text-center mb-6">
              <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center overflow-hidden mx-auto">
                <Image
                  src="/rakotomalala_logo.png"
                  alt="Logo Rakotomalala"
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>
              <h1 className="text-2xl font-bold text-foreground mt-4">Connexion</h1>
              <p className="text-muted-foreground mt-1">Gestion de trésorerie</p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-red-100 border border-red-200 text-red-600 rounded">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="vous@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-500 hover:from-green-600 hover:to-green-600"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-primary hover:underline">
            S&#39;inscrire
          </a>
        </p>
      </div>
    </div>
  )
}