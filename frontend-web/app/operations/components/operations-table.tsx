"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2 } from "lucide-react"
import { CATEGORIE_LABELS, STATUT_OPERATION_LABELS, MODE_PAIEMENT_LABELS } from "@/lib/constants"
import type { Operation } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

interface OperationsTableProps {
  operations: Operation[]
  onView?: (operation: Operation) => void
  onEdit?: (operation: Operation) => void
  onDelete?: (id: number) => void
}

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

export function OperationsTable({ operations, onView, onEdit, onDelete }: OperationsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-purple-200">
            <TableHead className="text-blue-900">Membre</TableHead>
            <TableHead className="text-blue-900">Type</TableHead>
            <TableHead className="text-blue-900">Catégorie</TableHead>
            <TableHead className="text-right text-blue-900">Montant</TableHead>
            <TableHead className="text-blue-900">Date</TableHead>
            <TableHead className="text-blue-900">Mode</TableHead>
            <TableHead className="text-blue-900">Statut</TableHead>
            <TableHead className="text-blue-900">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-purple-200">
          {operations.map((op) => {
            const isDepense = op.type_operation?.categorie === "depense"
            const membre = op.membre
            const nomComplet = membre?.user
              ? `${membre.user.prenom} ${membre.user.nom}`
              : "Membre inconnu"
            return (
              <TableRow key={op.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">
                  {nomComplet}
                </TableCell>
                <TableCell>{op.type_operation?.nom}</TableCell>
                <TableCell>
                  <Badge className={categoryColors[op.type_operation?.categorie || ""]}>
                    {CATEGORIE_LABELS[op.type_operation?.categorie || "autres"]}
                  </Badge>
                </TableCell>
                <TableCell className={`text-right font-mono ${isDepense ? "text-red-600" : "text-green-600"}`}>
                  {isDepense ? "-" : "+"}{formatCurrency(op.montant)}
                </TableCell>
                <TableCell>{formatDate(op.date_operation)}</TableCell>
                <TableCell>{MODE_PAIEMENT_LABELS[op.mode_paiement]}</TableCell>
                <TableCell>
                  <Badge className={statusColors[op.statut]}>{STATUT_OPERATION_LABELS[op.statut]}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {onView && (
                      <Button variant="ghost" size="icon" onClick={() => onView(op)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button variant="ghost" size="icon" onClick={() => onEdit(op)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(op.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
          {operations.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Aucune opération trouvée.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}