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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react"

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
  { name: "Dépenses", value: 8900, color: "#dc2626" },
]

export default function TresorierDashboard() {
  return (
    <ProtectedRoute requiredPermission="canManageOperations">
      <div className="flex h-screen bg-background">
        <Sidebar />

        <main className="flex-1 overflow-auto lg:ml-64">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Tableau de bord Trésorier</h1>
              <p className="text-muted-foreground mt-1">Gestion financière et opérations</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Solde Actuel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">45,200 €</div>
                    <DollarSign className="w-8 h-8 text-primary/50" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">+8.2% vs dernier mois</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenus Mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">7,100 €</div>
                    <ArrowUpRight className="w-8 h-8 text-green-600/50" />
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
                    <div className="text-2xl font-bold">3,500 €</div>
                    <ArrowDownLeft className="w-8 h-8 text-destructive/50" />
                  </div>
                  <p className="text-xs text-red-600 mt-2">+9.4% vs avril</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Cotisations Mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">5,200 €</div>
                    <TrendingUp className="w-8 h-8 text-blue-600/50" />
                  </div>
                  <p className="text-xs text-blue-600 mt-2">240 cotisations</p>
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
                  <CardTitle>Répartition des Revenus</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={operationsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name }) => name ?? ""}
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

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2 flex-wrap">
                <Button>
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Ajouter une Cotisation
                </Button>
                <Button variant="outline">
                  <ArrowDownLeft className="w-4 h-4 mr-2" />
                  Enregistrer une Dépense
                </Button>
                <Button variant="outline">Générer un Rapport</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
