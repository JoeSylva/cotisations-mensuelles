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
import { Users, DollarSign, TrendingUp, Calendar } from "lucide-react"
import { useDashboardStats } from "./hooks/useDashboardStats"
import { useMonthlyEvolution } from "./hooks/useMonthlyEvolution"
import { formatCurrency } from "@/lib/utils"
import { useMemo, useState } from "react"

const COLORS = {
  cotisation: "#2563eb",
  don: "#16a34a",
  depense: "#dc2626",
  autres: "#f59e0b",
}

export default function AdminDashboard() {
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const { stats, loading: statsLoading, error: statsError } = useDashboardStats()
  const { data: monthlyData, loading: monthlyLoading, error: monthlyError } = useMonthlyEvolution(selectedYear)

  const kpis = useMemo(() => {
    if (!stats) return null
    const revenus = stats.stats_categories
      .filter(cat => cat.sens === "credit")
      .reduce((sum, cat) => sum + cat.total, 0)
    const depenses = stats.stats_categories
      .filter(cat => cat.sens === "debit")
      .reduce((sum, cat) => sum + cat.total, 0)
    return {
      totalMembres: stats.nombre_membres,
      solde: stats.solde_total,
      revenusMois: revenus,
      depensesMois: depenses,
    }
  }, [stats])

  const pieData = useMemo(() => {
    if (!stats) return []
    return stats.stats_categories
      .filter(cat => cat.total > 0)
      .map(cat => ({
        name: cat.categorie === "cotisation" ? "Cotisations"
          : cat.categorie === "don" ? "Dons"
          : cat.categorie === "depense" ? "Dépenses"
          : "Autres",
        value: cat.total,
        color: COLORS[cat.categorie as keyof typeof COLORS] || "#9ca3af",
      }))
  }, [stats])

  const loading = statsLoading || monthlyLoading
  const error = statsError || monthlyError

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
    <ProtectedRoute requiredPermission="canManageUsers">
      <div className="flex h-screen bg-background">
        <Sidebar />

        <main className="flex-1 overflow-auto lg:ml-64">
          <div className="p-6 lg:p-8">
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
                    <div className="text-2xl font-bold">{kpis?.totalMembres ?? 0}</div>
                    <Users className="w-8 h-8 text-primary/50" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">Membres actifs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Solde</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{formatCurrency(kpis?.solde ?? 0)}</div>
                    <DollarSign className="w-8 h-8 text-accent/50" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">Solde actuel</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenus Mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{formatCurrency(kpis?.revenusMois ?? 0)}</div>
                    <TrendingUp className="w-8 h-8 text-green-600/50" />
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Dépenses Mois</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">{formatCurrency(kpis?.depensesMois ?? 0)}</div>
                    <Calendar className="w-8 h-8 text-destructive/50" />
                  </div>
                  <p className="text-xs text-red-600 mt-2">
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
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Revenus vs Dépenses</CardTitle>
                      <CardDescription>Évolution mensuelle</CardDescription>
                    </div>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="border rounded p-1 text-sm"
                    >
                      {[2024, 2025, 2026].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
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
                  <CardTitle>Répartition des Opérations</CardTitle>
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
                          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
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
                  {stats?.dernieres_operations?.slice(0, 5).map((op) => (
                    <div key={op.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">
                          {op.membre?.user?.prenom} {op.membre?.user?.nom}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {op.type_operation?.nom} • {new Date(op.date_operation).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span className={`font-bold ${op.type_operation?.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(op.montant)}
                      </span>
                    </div>
                  ))}
                  {(!stats?.dernieres_operations || stats.dernieres_operations.length === 0) && (
                    <p className="text-center text-gray-500 py-4">Aucune opération récente</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}