"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { useState } from "react"
import { useTypeOperations } from "./hooks/use-type-operations"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { TypeOperation } from "@/lib/types"

const categoryLabels = {
  cotisation: "Cotisation",
  don: "Don",
  depense: "Dépense",
  autres: "Autres",
}

const typeLabels = {
  debit: "Débit",
  credit: "Crédit",
}

// Fonction pour déterminer la classe de fond de la carte
const getCardBgClass = (typeOp: TypeOperation): string => {
  if (typeOp.type === "debit") {
    return "bg-amber-50 border-l-4 border-l-amber-500 hover:border-l-amber-600"
  }
  // type === "credit"
  switch (typeOp.categorie) {
    case "cotisation":
      return "bg-green-50 border-l-4 border-l-green-500 hover:border-l-green-600"
    case "don":
    case "autres":
    default:
      return "bg-purple-50 border-l-4 border-l-purple-500 hover:border-l-purple-600"
  }
}

export default function TypeOperationsPage() {
  const { typeOperations, loading, error, deleteType } = useTypeOperations()
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredTypeOps = typeOperations.filter(
    (op) =>
      op.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce type d'opération ?")) {
      try {
        await deleteType(id)
      } catch {
        alert("Erreur lors de la suppression")
      }
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center bg-purple-100">Chargement...</div>
  if (error) return <div className="flex h-screen items-center justify-center bg-purple-100 text-destructive">{error}</div>

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64 bg-purple-100">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Types d&#39;Opérations</h1>
              <p className="text-purple-700 mt-1">Gérer les catégories et types de transactions</p>
            </div>
            <Link href="/type-operations/new">
              <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4" />
                Nouveau Type
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              placeholder="Rechercher un type d'opération..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md h-12 border-purple-200 bg-white focus:ring-purple-500"
            />
          </div>

          {/* Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTypeOps.map((typeOp) => (
              <Card key={typeOp.id} className={`shadow-md ${getCardBgClass(typeOp)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-800">{typeOp.nom}</CardTitle>
                      <CardDescription className="mt-1 text-gray-600">{typeOp.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Catégorie:</span>
                      <span className="font-medium text-gray-800">{categoryLabels[typeOp.categorie]}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span
                        className={`font-medium ${
                          typeOp.type === "credit" ? "text-green-600" : "text-amber-600"
                        }`}
                      >
                        {typeLabels[typeOp.type]}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 bg-transparent hover:bg-white/50"
                      onClick={() => router.push(`/type-operations/${typeOp.id}/edit`)}
                    >
                      <Edit2 className="w-3 h-3" />
                      Éditer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 text-red-600 hover:text-red-700 bg-transparent hover:bg-white/50"
                      onClick={() => handleDelete(typeOp.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                      Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTypeOps.length === 0 && (
            <Card className="mt-8 bg-white">
              <CardContent className="pt-8">
                <p className="text-center text-gray-500">Aucun type d&#39;opération trouvé</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}