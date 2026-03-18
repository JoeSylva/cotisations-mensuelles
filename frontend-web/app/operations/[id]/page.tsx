"use client"

import { Sidebar } from "@/components/sidebar"
import { OperationForm } from "../components/operation-form"
import { useOperations, type UpdateOperationData } from "../hooks/use-operations"
import { useMembres } from "@/app/members/hooks/use-membres"
import { useTypeOperations } from "@/app/type-operations/hooks/use-type-operations"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Operation } from "@/lib/types"
import { operationsAPI } from "@/lib/api"

export default function EditOperationPage() {
  const { id } = useParams()
  const router = useRouter()
  const { updateOperation } = useOperations()
  const { membres } = useMembres()
  const { typeOperations } = useTypeOperations()
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

  const handleSubmit = async (data: Partial<Operation>) => {
    // Construire l'objet de mise à jour avec les champs modifiables
    const updateData: UpdateOperationData = {
      type_operation_id: data.type_operation_id,
      montant: data.montant,
      date_operation: data.date_operation,
      mode_paiement: data.mode_paiement,
      mois_cotisation: data.mois_cotisation,
      description: data.description,
      reference_paiement: data.reference_paiement,
      statut: data.statut,
    }

    try {
      await updateOperation(Number(id), updateData)
      router.push("/operations")
    } catch{
      alert("Erreur lors de la mise à jour")
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center">Chargement...</div>
  if (!operation) return null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-6 lg:p-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/operations">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Modifier l&#39;opération</h1>
              <p className="text-muted-foreground mt-1">Modifiez les détails de la transaction</p>
            </div>
          </div>

          <OperationForm
            membres={membres}
            typeOperations={typeOperations}
            operation={operation}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  )
}