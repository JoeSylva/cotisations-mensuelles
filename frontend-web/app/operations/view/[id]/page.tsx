"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { operationsAPI } from "@/lib/api"
import type { Operation } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CATEGORIE_LABELS, MODE_PAIEMENT_LABELS, STATUT_OPERATION_LABELS } from "@/lib/constants"

const statusColors: Record<string, string> = {
  valide: "bg-green-100 text-green-800",
  annule: "bg-red-100 text-red-800",
  en_attente: "bg-yellow-100 text-yellow-800",
}

const categoryColors: Record<string, string> = {
  cotisation: "bg-blue-100 text-blue-800",
  don: "bg-purple-100 text-purple-800",
  depense: "bg-orange-100 text-orange-800",
  autres: "bg-gray-100 text-gray-800",
}

export default function ViewOperationPage() {
  const { id } = useParams()
  const router = useRouter()
  const [operation, setOperation] = useState<Operation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      operationsAPI.getOne(Number(id))
        .then(setOperation)
        .catch(() => router.push("/operations"))
        .finally(() => setLoading(false))
    }
  }, [id, router])

  if (loading) return <div className="flex h-screen items-center justify-center">Chargement...</div>
  if (!operation) return null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-6 lg:p-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/operations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Détails de l&#39;opération</h1>
              <p className="text-muted-foreground mt-1">Informations complètes</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Opération #{operation.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Membre</p>
                  <p className="font-medium">{operation.membre?.prenom} {operation.membre?.nom}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type d&#39;opération</p>
                  <p className="font-medium">{operation.type_operation?.nom}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Catégorie</p>
                  <Badge className={categoryColors[operation.type_operation?.categorie || "autres"]}>
                    {CATEGORIE_LABELS[operation.type_operation?.categorie || "autres"]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Montant</p>
                  <p className={`text-lg font-bold ${operation.type_operation?.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {operation.type_operation?.type === "credit" ? "+" : "-"}
                    {formatCurrency(operation.montant)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date de l&#39;opération</p>
                  <p className="font-medium">{formatDate(operation.date_operation)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mode de paiement</p>
                  <p className="font-medium">{MODE_PAIEMENT_LABELS[operation.mode_paiement]}</p>
                </div>
              </div>

              {operation.mois_cotisation && (
                <div>
                  <p className="text-sm text-muted-foreground">Mois de cotisation</p>
                  <p className="font-medium">{operation.mois_cotisation}</p>
                </div>
              )}

              {operation.reference_paiement && (
                <div>
                  <p className="text-sm text-muted-foreground">Référence paiement</p>
                  <p className="font-medium">{operation.reference_paiement}</p>
                </div>
              )}

              {operation.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{operation.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <Badge className={statusColors[operation.statut]}>
                    {STATUT_OPERATION_LABELS[operation.statut]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Enregistré par</p>
                  <p className="font-medium">{operation.created_by_user?.prenom} {operation.created_by_user?.nom}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Link href={`/operations/${operation.id}/edit`}>
                  <Button variant="default">Modifier</Button>
                </Link>
                <Link href="/operations">
                  <Button variant="outline">Retour à la liste</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}