"use client"

import { Sidebar } from "@/components/sidebar"
import { OperationForm } from "../components/operation-form"
import { useOperations, type CreateOperationData } from "../hooks/use-operations"
import { useMembres } from "@/app/members/hooks/use-membres"
import { useTypeOperations } from "@/app/type-operations/hooks/use-type-operations"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Operation } from "@/lib/types"

export default function NewOperationPage() {
  const { createOperation } = useOperations()
  const { membres } = useMembres()
  const { typeOperations } = useTypeOperations()
  const router = useRouter()

  const handleSubmit = async (data: Partial<Operation>) => {
      if (!data.membre_id || !data.type_operation_id || !data.montant || !data.date_operation || !data.mode_paiement) {
          alert("Veuillez remplir tous les champs obligatoires");
          return;
      }

      const isCotisation = data.mois_cotisations && data.mois_cotisations.length > 0;
      const operationData: CreateOperationData = {
          membre_id: data.membre_id,
          type_operation_id: data.type_operation_id,
          montant: data.montant,
          date_operation: data.date_operation,
          mode_paiement: data.mode_paiement,
          description: data.description,
          reference_paiement: data.reference_paiement,
          statut: data.statut,
      };
      if (isCotisation) {
          operationData.mois_cotisations = data.mois_cotisations;
      } else {
          operationData.mois_cotisation = data.mois_cotisation;
      }

      try {
          await createOperation(operationData);
          router.push("/operations");
      } catch {
          alert("Erreur lors de la création de l'opération");
      }
  };

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
              <h1 className="text-3xl font-bold text-foreground">Nouvelle opération</h1>
              <p className="text-muted-foreground mt-1">Enregistrez une nouvelle transaction</p>
            </div>
          </div>

          <OperationForm
            membres={membres}
            typeOperations={typeOperations}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
    </div>
  )
}