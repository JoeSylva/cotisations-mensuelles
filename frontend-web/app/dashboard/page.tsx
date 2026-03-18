"use client"

import { Sidebar } from "@/components/sidebar"
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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, DollarSign, TrendingUp, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Données mockées – à remplacer par des appels API réels
const monthlyData = [
  { month: "Jan", revenus: 4000, depenses: 2400 },
  { month: "Fév", revenus: 5200, depenses: 2800 },
  { month: "Mar", revenus: 4800, depenses: 3000 },
  { month: "Avr", revenus: 6200, depenses: 3200 },
  { month: "Mai", revenus: 5800, depenses: 2900 },
  { month: "Jun", revenus: 7100, depenses: 3500 },
]

const operationsData = [
  { name: "Cotisations", value: 12500, color: "#2563eb" },
  { name: "Dons", value: 3200, color: "#16a34a" },
  { name: "Dépenses", value: -8900, color: "#dc2626" },
]

const recentOperations = [
  { id: 1, member: "Jean Dupont", type: "Cotisation", amount: 50, date: "2024-01-15" },
  { id: 2, member: "Marie Martin", type: "Don", amount: 100, date: "2024-01-14" },
  { id: 3, member: "Pierre Bernard", type: "Cotisation", amount: 50, date: "2024-01-13" },
]

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
      } else {
        // Redirection basée sur le rôle
        switch (user.role) {
          case "admin":
            router.push("/dashboard/admin")
            break
          case "tresorier":
            router.push("/dashboard/tresorier")
            break
          case "membre":
            router.push("/dashboard/member")
            break
          default:
            router.push("/login")
        }
      }
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Redirection...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
            <p className="text-muted-foreground mt-1">
              Bienvenue, {user.prenom} {user.nom} !
            </p>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Solde</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">45 200 €</div>
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
                  <div className="text-2xl font-bold">7 100 €</div>
                  <TrendingUp className="w-8 h-8 text-green-600/50" />
                </div>
                <p className="text-xs text-green-600 mt-2">+15.3% vs avril</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Dépenses Mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-bold">3 500 €</div>
                  <Calendar className="w-8 h-8 text-destructive/50" />
                </div>
                <p className="text-xs text-red-600 mt-2">+9.4% vs avril</p>
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
                <CardTitle>Répartition des Opérations</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={operationsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name }) => name}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {operationsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Operations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Opérations Récentes</CardTitle>
                  <CardDescription>Les 10 dernières transactions</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOperations.map((op) => (
                  <div key={op.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{op.member}</p>
                      <p className="text-sm text-muted-foreground">
                        {op.type} • {op.date}
                      </p>
                    </div>
                    <span className={`font-bold ${op.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {op.amount > 0 ? "+" : ""}
                      {op.amount} €
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}