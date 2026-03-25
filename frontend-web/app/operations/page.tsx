"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Download, Loader2 } from "lucide-react"
import { OperationsTable } from "./components/operations-table"
import { useOperations } from "./hooks/use-operations"
import { useTypeOperations } from "./hooks/use-type-operations"
import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Operation, TypeOperation } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

export default function OperationsPage() {
  const { operations, loading, error, filters, setFilters, deleteOperation } = useOperations()
  const { typeOperations } = useTypeOperations()
  const router = useRouter()

  const [localFilters, setLocalFilters] = useState({
    search: "",
    date_debut: "",
    date_fin: "",
    categorie: "all", // "all" signifie toutes catégories
    statut: "all",    // "all" signifie tous statuts
  })

  // Mapper la catégorie vers l'ID du type d'opération (pour l'API)
  const categorieToTypeIds = useMemo(() => {
    if (!typeOperations.length) return {}
    const map: Record<string, number[]> = {}
    typeOperations.forEach((t) => {
      const cat = t.categorie
      if (!map[cat]) map[cat] = []
      map[cat].push(t.id)
    })
    return map
  }, [typeOperations])

  // Appliquer les filtres à l'API (dates et catégorie)
  const applyApiFilters = () => {
    const newFilters: Record<string, string> = {}
    if (localFilters.date_debut) newFilters.date_debut = localFilters.date_debut
    if (localFilters.date_fin) newFilters.date_fin = localFilters.date_fin
    if (localFilters.categorie !== "all" && categorieToTypeIds[localFilters.categorie]?.length) {
      newFilters.type_operation_id = categorieToTypeIds[localFilters.categorie].join(",")
    }
    setFilters(newFilters)
  }

  // Filtrer les opérations côté client pour la recherche et le statut
  const filteredOperations = useMemo(() => {
    let filtered = [...operations]
    if (localFilters.search.trim()) {
      const searchTerm = localFilters.search.toLowerCase()
      filtered = filtered.filter(op => 
        op.membre?.prenom?.toLowerCase().includes(searchTerm) ||
        op.membre?.nom?.toLowerCase().includes(searchTerm) ||
        op.type_operation?.nom?.toLowerCase().includes(searchTerm) ||
        op.description?.toLowerCase().includes(searchTerm) ||
        op.reference_paiement?.toLowerCase().includes(searchTerm)
      )
    }
    if (localFilters.statut !== "all") {
      filtered = filtered.filter(op => op.statut === localFilters.statut)
    }
    return filtered
  }, [operations, localFilters.search, localFilters.statut])

  // Calcul du total (revenus - dépenses)
  const total = useMemo(() => {
    let totalRevenus = 0
    let totalDepenses = 0
    filteredOperations.forEach(op => {
      // Conversion explicite du montant en nombre
      const montant = Number(op.montant)
      if (isNaN(montant)) return // éviter les NaN
      const categorie = op.type_operation?.categorie
      if (categorie === 'depense') {
        totalDepenses += montant
      } else {
        totalRevenus += montant
      }
    })
    return totalRevenus - totalDepenses
  }, [filteredOperations])

  // Chargement initial : appel API quand les dates ou la catégorie changent
  useEffect(() => {
    applyApiFilters()
  }, [localFilters.date_debut, localFilters.date_fin, localFilters.categorie])

  const handleView = (operation: Operation) => router.push(`/operations/view/${operation.id}`)
  const handleEdit = (operation: Operation) => router.push(`/operations/${operation.id}`)
  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette opération ?")) {
      try {
        await deleteOperation(id)
      } catch {
        alert("Erreur lors de la suppression")
      }
    }
  }

  if (loading && operations.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-100">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-100">
        <div className="text-destructive">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64 bg-purple-100">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Registre des Opérations</h1>
              <p className="text-purple-700 mt-1">Suivi de toutes les transactions financières</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50">
                <Download className="w-4 h-4" />
                Exporter
              </Button>
              <Link href="/operations/new">
                <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4" />
                  Nouvelle Opération
                </Button>
              </Link>
            </div>
          </div>

          {/* Filtres */}
          <Card className="border-purple-200 shadow-md mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Input
                  placeholder="Rechercher (membre, type, référence...)"
                  value={localFilters.search}
                  onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
                  className="border-purple-200 focus:ring-purple-500"
                />
                <Input
                  type="date"
                  placeholder="Date début"
                  value={localFilters.date_debut}
                  onChange={(e) => setLocalFilters({ ...localFilters, date_debut: e.target.value })}
                  className="border-purple-200 focus:ring-purple-500"
                />
                <Input
                  type="date"
                  placeholder="Date fin"
                  value={localFilters.date_fin}
                  onChange={(e) => setLocalFilters({ ...localFilters, date_fin: e.target.value })}
                  className="border-purple-200 focus:ring-purple-500"
                />
                <Select
                  value={localFilters.categorie}
                  onValueChange={(val) => setLocalFilters({ ...localFilters, categorie: val })}
                >
                  <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                    <SelectValue placeholder="Toutes catégories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    <SelectItem value="cotisation">Cotisation</SelectItem>
                    <SelectItem value="don">Don</SelectItem>
                    <SelectItem value="depense">Dépense</SelectItem>
                    <SelectItem value="autres">Autres</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={localFilters.statut}
                  onValueChange={(val) => setLocalFilters({ ...localFilters, statut: val })}
                >
                  <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                    <SelectValue placeholder="Tous statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="valide">Validé</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="annule">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tableau des opérations */}
          <Card className="border-purple-200 shadow-md">
            <CardHeader className="bg-purple-50 border-b border-purple-200">
              <CardTitle className="text-blue-900 font-bold">Opérations</CardTitle>
              <CardDescription className="text-purple-600">
                {filteredOperations.length} opération(s) trouvée(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <OperationsTable
                operations={filteredOperations}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              {/* Total en bas du tableau */}
              <div className="mt-6 border-t border-purple-200 pt-4 flex justify-end">
                <div className="bg-purple-50 px-4 py-2 rounded-lg">
                  <span className="text-purple-700 font-medium">Total : </span>
                  <span className={`font-bold ${total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}