"use client"

import { Sidebar } from "@/components/sidebar"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Users, DollarSign, TrendingUp, AlertCircle, Settings } from "lucide-react"

const monthlyData = [
  { month: "Jan", revenus: 4000, depenses: 2400 },
  { month: "Fév", revenus: 5200, depenses: 2800 },
  { month: "Mar", revenus: 4800, depenses: 3000 },
  { month: "Avr", revenus: 6200, depenses: 3200 },
  { month: "Mai", revenus: 5800, depenses: 2900 },
  { month: "Jun", revenus: 7100, depenses: 3500 },
]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const operationsData = [
  { name: "Cotisations", value: 12500, color: "#2563eb" },
  { name: "Dons", value: 3200, color: "#16a34a" },
  { name: "Dépenses", value: -8900, color: "#dc2626" },
]

const memberStats = [
  { role: "Admin", count: 2 },
  { role: "Trésorier", count: 1 },
  { role: "Membre", count: 245 },
]

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredPermission="canManageUsers">
      <div className="flex h-screen bg-background">
        <Sidebar />

        <main className="flex-1 overflow-auto lg:ml-64">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Tableau de bord Administrateur</h1>
              <p className="text-muted-foreground mt-1">Vue d&#39;ensemble complète du système</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Membres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">248</div>
                    <Users className="w-8 h-8 text-primary/50" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">+12 ce mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Solde Général</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">45,200 €</div>
                    <DollarSign className="w-8 h-8 text-accent/50" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">+8.2% depuis le mois dernier</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenus Mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">7,100 €</div>
                    <TrendingUp className="w-8 h-8 text-green-600/50" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">+15.3% vs avril</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Alertes Système</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">2</div>
                    <AlertCircle className="w-8 h-8 text-destructive/50" />
                  </div>
                  <p className="text-xs text-red-600 mt-2">À traiter</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Revenus vs Dépenses</CardTitle>
                  <CardDescription>Évolution sur les 6 derniers mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="revenus" stroke="#2563eb" strokeWidth={2} />
                      <Line type="monotone" dataKey="depenses" stroke="#dc2626" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Rôle</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={memberStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="role" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Admin Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Administrateur</CardTitle>
                <CardDescription>Gestion du système</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres Système
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Gérer les Utilisateurs
                </Button>
                <Button variant="outline" size="sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Voir les Alertes
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
