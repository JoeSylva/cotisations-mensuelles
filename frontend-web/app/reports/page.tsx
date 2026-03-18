"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Download } from "lucide-react"
import { OperationsTable } from "../operations/components/operations-table"
import { useOperations } from "../operations/hooks/use-operations"
import { useState } from "react"
import Link from "next/link"

export default function OperationsPage() {
  const { operations, loading, error, filters, setFilters } = useOperations()
  const [localFilters, setLocalFilters] = useState({
    search: "",
    date_debut: "",
    date_fin: "",
    categorie: "",
    statut: "",
  })

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const newFilters: Record<string, string> = {}
    if (localFilters.date_debut) newFilters.date_debut = localFilters.date_debut
    if (localFilters.date_fin) newFilters.date_fin = localFilters.date_fin
    if (localFilters.categorie) newFilters.categorie = localFilters.categorie
    if (localFilters.statut) newFilters.statut = localFilters.statut
    if (localFilters.search) newFilters.search = localFilters.search
    setFilters(newFilters)
  }

  if (loading) return <div className="flex h-screen items-center justify-center">Chargement...</div>
  if (error) return <div className="flex h-screen items-center justify-center text-destructive">{error}</div>

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Registre des Opérations</h1>
              <p className="text-muted-foreground mt-1">Suivi de toutes les transactions financières</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Exporter
              </Button>
              <Link href="/operations/new">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                  Nouvelle Opération
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Input
              placeholder="Rechercher..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            <Input
              type="date"
              placeholder="Date début"
              value={localFilters.date_debut}
              onChange={(e) => handleFilterChange("date_debut", e.target.value)}
            />
            <Input
              type="date"
              placeholder="Date fin"
              value={localFilters.date_fin}
              onChange={(e) => handleFilterChange("date_fin", e.target.value)}
            />
            <select
              className="px-3 py-2 border border-border rounded-lg bg-background"
              value={localFilters.categorie}
              onChange={(e) => handleFilterChange("categorie", e.target.value)}
            >
              <option value="">Toutes catégories</option>
              <option value="cotisation">Cotisation</option>
              <option value="don">Don</option>
              <option value="depense">Dépense</option>
              <option value="autres">Autres</option>
            </select>
            <select
              className="px-3 py-2 border border-border rounded-lg bg-background"
              value={localFilters.statut}
              onChange={(e) => handleFilterChange("statut", e.target.value)}
            >
              <option value="">Tous statuts</option>
              <option value="valide">Validé</option>
              <option value="en_attente">En attente</option>
              <option value="annule">Annulé</option>
            </select>
          </div>
          <div className="flex justify-end mb-4">
            <Button onClick={applyFilters}>Appliquer les filtres</Button>
          </div>

          {/* Operations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Opérations</CardTitle>
              <CardDescription>Total: {operations.length} opération(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <OperationsTable operations={operations} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}