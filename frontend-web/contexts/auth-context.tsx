"use client"

import React, { createContext, useContext, useState } from "react"
import { useRouter } from "next/navigation"

export interface User {
  id: number
  nom: string
  prenom: string
  email: string
  role: "admin" | "tresorier" | "membre"
  telephone?: string
  created_at?: string
  updated_at?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
  })
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        return JSON.parse(storedUser)
      } catch {
        return null
      }
    }
    return null
  })
  const [loading] = useState(false) // Pas de chargement asynchrone initial
  const router = useRouter()

  const login = async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || data.error || "Erreur de connexion")
    }
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
  }

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (error) {
        console.error("Erreur lors de la déconnexion", error)
      }
    }
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    router.push("/login")
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}