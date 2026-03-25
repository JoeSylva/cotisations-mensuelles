"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Lock, Users, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useState } from "react"
import { userAPI } from "@/lib/api"

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Profil
  const [formData, setFormData] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
  })

  // Mot de passe
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const updatedUser = await userAPI.updateProfile(formData)
      updateUser(updatedUser)
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès' })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
      return
    }
    setPasswordLoading(true)
    setMessage(null)
    try {
      await userAPI.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      })
      setMessage({ type: 'success', text: 'Mot de passe changé avec succès' })
      setPasswordData({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setPasswordLoading(false)
    }
  }
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-6 lg:p-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
            <p className="text-muted-foreground mt-1">Gérez vos préférences et configurations</p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <div className="space-y-6">
            {/* Profil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Profil
                </CardTitle>
                <CardDescription>Informations de votre compte</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Prénom</label>
                      <Input
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Nom</label>
                      <Input
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Téléphone</label>
                    <Input
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Enregistrer
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sécurité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Sécurité
                </CardTitle>
                <CardDescription>Protégez votre compte</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Ancien mot de passe</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Nouveau mot de passe</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Confirmer le mot de passe</label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={passwordData.new_password_confirmation}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={passwordLoading} className="bg-primary hover:bg-primary/90">
                    {passwordLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Changer le mot de passe
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Notifications (statique) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Gérez vos préférences de notification</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">Notifications par email</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">Alertes de transactions</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Rapports mensuels</span>
                </label>
                <Button className="bg-primary hover:bg-primary/90">Enregistrer</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}