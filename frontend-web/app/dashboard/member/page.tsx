"use client"

import { Sidebar } from "@/components/sidebar"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { Calendar, DollarSign, User, Mail, Phone } from "lucide-react"

export default function MemberDashboard() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />

        <main className="flex-1 overflow-auto lg:ml-64">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Mon Espace</h1>
              <p className="text-muted-foreground mt-1">
                Bienvenue {user?.prenom} {user?.nom}
              </p>
            </div>

            {/* Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Mon Profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">
                        {user?.prenom} {user?.nom}
                      </p>
                      <p className="text-sm text-muted-foreground">Membre depuis 2023</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>
                    {user?.telephone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <p className="font-medium">{user.telephone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Membership Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statut Adhésion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="text-lg font-bold text-green-600">Actif</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date d&#39;adhésion</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium">15 janvier 2023</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contributions Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Mes Cotisations</CardTitle>
                <CardDescription>Historique des 3 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { mois: "Juin 2024", montant: 50, statut: "Payée" },
                    { mois: "Mai 2024", montant: 50, statut: "Payée" },
                    { mois: "Avril 2024", montant: 50, statut: "Payée" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{item.mois}</p>
                        <p className="text-sm text-muted-foreground">{item.statut}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-green-600">{item.montant} €</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
