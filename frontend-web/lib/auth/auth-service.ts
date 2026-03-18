import type { User } from "@/lib/types"

// Mock user for demo - Replace with actual Supabase/Neon auth
export const mockUser: User = {
  id: 1,
  uuid: "550e8400-e29b-41d4-a716-446655440000",
  nom: "Dupont",
  prenom: "Jean",
  email: "admin@gestass.com",
  telephone: "+33612345678",
  role: "admin",
  password: "hashed_password",
  email_verified_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export async function login(email: string, password: string): Promise<User | null> {
  // TODO: Replace with actual Supabase/Neon authentication
  // This is a mock implementation for demo purposes
  if (email === "admin@gestass.com" && password === "admin") {
    return mockUser
  }
  return null
}

export async function logout(): Promise<void> {
  // TODO: Implement actual logout with Supabase/Neon
  localStorage.removeItem("user")
}

export async function getCurrentUser(): Promise<User | null> {
  // TODO: Fetch from Supabase/Neon session
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export async function registerUser(email: string, password: string, nom: string, prenom: string): Promise<User | null> {
  // TODO: Replace with actual Supabase/Neon registration
  console.log("Register:", { email, nom, prenom })
  return null
}
