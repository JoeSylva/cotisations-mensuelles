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
import { useDashboardStats } from "../admin/hooks/useDashboardStats"
import { formatCurrency } from "@/lib/utils"
import { useMemo } from "react"

// Données mensuelles statiques (à remplacer par un vrai endpoint si disponible)
const monthlyData = [
  { month: "Jan", revenus: 4000, depenses: 2400 },
  { month: "Fév", revenus: 5200, depenses: 2800 },
  { month: "Mar", revenus: 4800, depenses: 3000 },
  { month: "Avr", revenus: 6200, depenses: 3200 },
  { month: "Mai", revenus: 5800, depenses: 2900 },
  { month: "Jun", revenus: 7100, depenses: 3500 },
]

export default function TresorierDashboard() {
  const { stats, loading, error } = useDashboardStats()

  // Calcul des KPI à partir des statistiques
  const kpis = useMemo(() => {
    if (!stats) return null

    const revenus = stats.stats_categories
      .filter(cat => cat.sens === 'credit')
      .reduce((sum, cat) => sum + cat.total, 0)

    const depenses = stats.stats_categories
      .filter(cat => cat.sens === 'debit')
      .reduce((sum, cat) => sum + cat.total, 0)

    const cotisations = stats.stats_categories
      .find(cat => cat.categorie === 'cotisation' && cat.sens === 'credit')?.total ?? 0

    return {
      solde: stats.solde_total,
      revenus,
      depenses,
      cotisations,
    }
  }, [stats])

  // Données pour le graphique en secteurs (uniquement les crédits)
  const pieData = useMemo(() => {
    if (!stats) return []
    return stats.stats_categories
      .filter(cat => cat.sens === 'credit')
      .map(cat => ({
        name: cat.categorie === 'cotisation' ? 'Cotisations' :
              cat.categorie === 'don' ? 'Dons' : cat.categorie,
        value: cat.total,
        color: cat.categorie === 'cotisation' ? '#2563eb' :
               cat.categorie === 'don' ? '#16a34a' : '#f59e0b',
      }))
  }, [stats])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-red-600">Erreur : {error}</p>
      </div>
    )
  }

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
                    <div className="text-2xl font-bold">{formatCurrency(kpis?.solde ?? 0)}</div>
                    <DollarSign className="w-8 h-8 text-primary/50" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">Solde total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenus Période</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{formatCurrency(kpis?.revenus ?? 0)}</div>
                    <ArrowUpRight className="w-8 h-8 text-green-600/50" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    {stats?.periode.debut && stats?.periode.fin
                      ? `du ${new Date(stats.periode.debut).toLocaleDateString('fr-FR')} au ${new Date(stats.periode.fin).toLocaleDateString('fr-FR')}`
                      : 'Période en cours'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Dépenses Période</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{formatCurrency(kpis?.depenses ?? 0)}</div>
                    <ArrowDownLeft className="w-8 h-8 text-destructive/50" />
                  </div>
                  <p className="text-xs text-red-600 mt-2">
                    {stats?.periode.debut && stats?.periode.fin
                      ? `du ${new Date(stats.periode.debut).toLocaleDateString('fr-FR')} au ${new Date(stats.periode.fin).toLocaleDateString('fr-FR')}`
                      : 'Période en cours'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Cotisations Période</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{formatCurrency(kpis?.cotisations ?? 0)}</div>
                    <TrendingUp className="w-8 h-8 text-blue-600/50" />
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    {stats?.periode.debut && stats?.periode.fin
                      ? `du ${new Date(stats.periode.debut).toLocaleDateString('fr-FR')} au ${new Date(stats.periode.fin).toLocaleDateString('fr-FR')}`
                      : 'Période en cours'}
                  </p>
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
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
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
                  {pieData.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Aucune donnée disponible</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent ?? 0 * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
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