"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  MODE_PAIEMENT_LABELS,
  STATUT_OPERATION_LABELS,
  STATUT_OPERATION_OPTIONS,
  MODE_PAIEMENT_OPTIONS,
} from "@/lib/constants"
import type { Operation, Membre, TypeOperation } from "@/lib/types"
import { MonthMultiSelect } from "@/components/month-multi-select"
import { generateMonthsFrom } from "@/lib/date-utils"

interface OperationFormProps {
  membres: Membre[]
  typeOperations: TypeOperation[]
  operation?: Operation
  onSubmit: (data: Partial<Operation>) => Promise<void>
}

// Fonction pour déterminer le tarif mensuel d'un membre
function getTarifMensuel(membre: Membre | undefined): number | null {
  if (!membre) return null;
  const aujourdHui = new Date();
  const dateNaissance = membre.date_naissance ? new Date(membre.date_naissance) : null;
  if (!dateNaissance) return null; // ou tarif par défaut

  const age = aujourdHui.getFullYear() - dateNaissance.getFullYear();
  const estMajeur = age >= 18;

  // Si moins de 18 ans -> 3000 Ar, sinon (adulte) -> 5000 Ar (peu importe la situation matrimoniale pour l'instant)
  // On pourrait affiner avec la situation matrimoniale si besoin
  return estMajeur ? 5000 : 3000;
}

export function OperationForm({ membres, typeOperations, operation, onSubmit }: OperationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Operation>>(
    operation || {
      statut: "valide",
      mode_paiement: "espece",
    },
  )
  const [selectedMonths, setSelectedMonths] = useState<string[]>(
    operation?.mois_cotisation ? [operation.mois_cotisation] : []
  )
  const [moisDebut, setMoisDebut] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  })

  // Récupérer le membre sélectionné
  const selectedMembre = membres.find(m => m.id === formData.membre_id);

  // Effet pour calculer automatiquement les mois en fonction du montant et du tarif
  useEffect(() => {
    const typeOp = typeOperations.find(t => t.id === formData.type_operation_id);
    if (typeOp?.categorie !== 'cotisation') return;

    const tarif = getTarifMensuel(selectedMembre);
    if (!tarif) return;

    const montant = formData.montant;
    if (!montant || montant <= 0) return;

    if (montant % tarif !== 0) {
      // Montant non multiple du tarif, on ne fait rien (on pourrait afficher un message)
      return;
    }

    const nbMois = montant / tarif;
    if (nbMois > 0 && Number.isInteger(nbMois)) {
      const nouveauxMois = generateMonthsFrom(moisDebut, nbMois);
      setSelectedMonths(nouveauxMois);
    }
  }, [formData.membre_id, formData.montant, formData.type_operation_id, moisDebut, selectedMembre, typeOperations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const typeOp = typeOperations.find(t => t.id === formData.type_operation_id)
      if (typeOp?.categorie === 'cotisation' && selectedMonths.length > 0) {
        for (const mois of selectedMonths) {
          await onSubmit({
            ...formData,
            mois_cotisation: mois,
          })
        }
      } else {
        await onSubmit(formData)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{operation ? "Modifier" : "Nouvelle"} Opération</CardTitle>
        <CardDescription>Enregistrez une transaction financière</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="membre">Membre</Label>
              <Select
                value={formData.membre_id?.toString() || ""}
                onValueChange={(value: string) => setFormData({ ...formData, membre_id: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un membre" />
                </SelectTrigger>
                <SelectContent>
                  {membres.map((m) => (
                    <SelectItem key={m.id} value={m.id.toString()}>
                      {m.prenom} {m.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type d&#39;Opération</Label>
              <Select
                value={formData.type_operation_id?.toString() || ""}
                onValueChange={(value: string) => setFormData({ ...formData, type_operation_id: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOperations.map((t) => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="montant">Montant</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.montant || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    montant: Number.parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date Opération</Label>
              <Input
                type="date"
                value={formData.date_operation || ""}
                onChange={(e) => setFormData({ ...formData, date_operation: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mode">Mode Paiement</Label>
              <Select
                value={formData.mode_paiement || "espece"}
                onValueChange={(value: string) =>
                  setFormData({
                    ...formData,
                    mode_paiement: value as Operation["mode_paiement"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODE_PAIEMENT_OPTIONS.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {MODE_PAIEMENT_LABELS[mode]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select
                value={formData.statut || "valide"}
                onValueChange={(value: string) =>
                  setFormData({
                    ...formData,
                    statut: value as Operation["statut"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUT_OPERATION_OPTIONS.map((statut) => (
                    <SelectItem key={statut} value={statut}>
                      {STATUT_OPERATION_LABELS[statut]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Champs spécifiques aux cotisations */}
          {typeOperations.find(t => t.id === formData.type_operation_id)?.categorie === 'cotisation' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="moisDebut">Mois de début</Label>
                <Input
                  type="month"
                  id="moisDebut"
                  value={moisDebut}
                  onChange={(e) => setMoisDebut(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Tarif mensuel estimé : {getTarifMensuel(selectedMembre) ?? '?'} Ar
                </p>
              </div>

              <MonthMultiSelect
                value={selectedMonths}
                onChange={setSelectedMonths}
                disabled={isLoading}
              />
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="reference">Référence Paiement</Label>
            <Input
              placeholder="Numéro de transaction ou référence"
              value={formData.reference_paiement || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  reference_paiement: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              placeholder="Notes supplémentaires"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Enregistrement..." : "Enregistrer Opération"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}