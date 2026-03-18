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
              <h1 className="text-3xl font-bold text-foreground">Types d&#39;Opérations</h1>
              <p className="text-muted-foreground mt-1">Gérer les catégories et types de transactions</p>
            </div>
            <Link href="/type-operations/new">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
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
              className="max-w-md"
            />
          </div>

          {/* Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTypeOps.map((typeOp) => (
              <Card key={typeOp.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{typeOp.nom}</CardTitle>
                      <CardDescription className="mt-1">{typeOp.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Catégorie:</span>
                      <span className="font-medium">{categoryLabels[typeOp.categorie]}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className={`font-medium ${typeOp.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                        {typeLabels[typeOp.type]}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 bg-transparent"
                      onClick={() => router.push(`/type-operations/${typeOp.id}/edit`)}
                    >
                      <Edit2 className="w-3 h-3" />
                      Éditer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 text-red-600 hover:text-red-700 bg-transparent"
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
            <Card className="mt-8">
              <CardContent className="pt-8">
                <p className="text-center text-muted-foreground">Aucun type d&#39;opération trouvé</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}