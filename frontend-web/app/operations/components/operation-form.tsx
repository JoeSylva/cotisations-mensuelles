"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MODE_PAIEMENT_LABELS,
  STATUT_OPERATION_LABELS,
  STATUT_OPERATION_OPTIONS,
  MODE_PAIEMENT_OPTIONS,
} from "@/lib/constants"
import type { Operation, Membre, TypeOperation } from "@/lib/types"

// -------------------------------------------------------------------
// Composant MonthMultiSelect (intégré pour plus de clarté)
// -------------------------------------------------------------------
interface MonthMultiSelectProps {
  value: string[]
  onChange: (months: string[]) => void
  startMonth?: string
  monthsRange?: number
}

function MonthMultiSelect({
  value,
  onChange,
  startMonth = new Date().toISOString().slice(0, 7),
  monthsRange = 48,
}: MonthMultiSelectProps) {
  const [months, setMonths] = useState<string[]>([])
  const startMonthRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const startDate = new Date(startMonth + "-01")
    const halfRange = Math.floor(monthsRange / 2)
    const firstMonth = new Date(startDate)
    firstMonth.setMonth(startDate.getMonth() - halfRange)

    const generated: string[] = []
    for (let i = 0; i < monthsRange; i++) {
      const date = new Date(firstMonth)
      date.setMonth(firstMonth.getMonth() + i)
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      generated.push(yearMonth)
    }
    setMonths(generated)
  }, [startMonth, monthsRange])

  useEffect(() => {
    if (startMonthRef.current) {
      startMonthRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [months])

  const handleCheck = (month: string, checked: boolean) => {
    if (checked) {
      onChange([...value, month])
    } else {
      onChange(value.filter(m => m !== month))
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-purple-700 font-semibold">Mois concernés</Label>
      <ScrollArea className="h-64 rounded-md border border-purple-200 bg-white p-2">
        <div className="space-y-2">
          {months.map(month => (
            <div
              key={month}
              ref={month === startMonth ? startMonthRef : null}
              className="flex items-center space-x-2 hover:bg-purple-50 p-1 rounded"
            >
              <Checkbox
                id={`month-${month}`}
                checked={value.includes(month)}
                onCheckedChange={checked => handleCheck(month, checked === true)}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <Label htmlFor={`month-${month}`} className="cursor-pointer text-gray-700">
                {formatMonth(month)}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-")
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
}

function getTarifMensuel(membre: Membre | undefined): number | null {
  if (!membre) return null
  const aujourdHui = new Date()
  const dateNaissance = membre.date_naissance ? new Date(membre.date_naissance) : null
  if (!dateNaissance) return null
  const age = aujourdHui.getFullYear() - dateNaissance.getFullYear()
  const estMajeur = age >= 18
  return estMajeur ? 5000 : 3000
}

// -------------------------------------------------------------------
// Composant principal
// -------------------------------------------------------------------
interface OperationFormProps {
  membres: Membre[]
  typeOperations: TypeOperation[]
  operation?: Operation
  onSubmit: (data: Partial<Operation>) => Promise<void>
}

export function OperationForm({ membres, typeOperations, operation, onSubmit }: OperationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Operation>>(
    operation || {
      statut: "valide",
      mode_paiement: "espece",
      membre_id: undefined,
    },
  )
  const [selectedMonths, setSelectedMonths] = useState<string[]>(
    operation?.mois_cotisation ? [operation.mois_cotisation] : []
  )
  const [moisDebut, setMoisDebut] = useState<string>(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })

  const selectedType = typeOperations.find(t => t.id === formData.type_operation_id)
  const estCotisation = selectedType?.categorie === "cotisation"
  const estDepense = selectedType?.categorie === "depense"

  // Recherche du membre "Trésorier" (nom = "Trésorier", prénom vide)
  const membreTresorier = useMemo(() => {
    return membres.find(m => m.nom === "Trésorier" && m.prenom === "")
  }, [membres])

  const selectedMembre = membres.find(m => m.id === formData.membre_id)

  // Changement de type d'opération
  const handleTypeChange = (value: string) => {
    const newTypeId = Number.parseInt(value)
    const type = typeOperations.find(t => t.id === newTypeId)
    if (type?.categorie === "depense") {
      // Pour une dépense, on associe automatiquement le membre trésorier
      if (membreTresorier) {
        setFormData({
          ...formData,
          type_operation_id: newTypeId,
          membre_id: membreTresorier.id,
        })
      } else {
        console.error("Le membre 'Trésorier' n'existe pas. Veuillez le créer.")
        setFormData({ ...formData, type_operation_id: newTypeId, membre_id: undefined })
      }
      setSelectedMonths([])
    } else {
      setFormData({ ...formData, type_operation_id: newTypeId, membre_id: undefined })
      if (type?.categorie !== "cotisation") {
        setSelectedMonths([])
      }
    }
  }

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
          const dataToSend = { ...formData };

          if (estDepense) {
              if (!membreTresorier) {
                  throw new Error("Le membre 'Trésorier' n'existe pas. Veuillez le créer avant d'enregistrer une dépense.");
              }
              dataToSend.membre_id = membreTresorier.id;
          } else {
              if (!dataToSend.membre_id) {
                  throw new Error("Veuillez sélectionner un membre.");
              }
          }

          // Pour une cotisation, on envoie le tableau des mois sélectionnés
          if (estCotisation && selectedMonths.length > 0) {
              await onSubmit({
                  ...dataToSend,
                  mois_cotisations: selectedMonths,
              });
          } else {
              await onSubmit(dataToSend);
          }
      } catch (err) {
          alert(err instanceof Error ? err.message : "Une erreur est survenue.");
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <Card className="border-purple-200 shadow-md flex flex-col max-h-full">
      <CardHeader className="bg-purple-50 border-b border-purple-200 flex-none">
        <CardTitle className="text-purple-800">
          {operation ? "Modifier" : "Nouvelle"} Opération
        </CardTitle>
        <CardDescription className="text-purple-600">
          Enregistrez une transaction financière
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ligne : Membre et Type d'opération */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="membre" className="text-purple-700 font-medium">
                Membre {!estDepense && <span className="text-red-500">*</span>}
              </Label>
              <Select
                value={formData.membre_id?.toString() || ""}
                onValueChange={value => setFormData({ ...formData, membre_id: Number.parseInt(value) })}
                disabled={estDepense}
              >
                <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                  <SelectValue placeholder={estDepense ? "Trésorier (dépense)" : "Sélectionner un membre"} />
                </SelectTrigger>
                {!estDepense && (
                  <SelectContent>
                    {membres.map(m => (
                      <SelectItem key={m.id} value={m.id.toString()}>
                        {m.user?.prenom} {m.user?.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                )}
              </Select>
              {estDepense && (
                <p className="text-xs text-muted-foreground">
                  Les dépenses sont automatiquement associées au Trésorier.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-purple-700 font-medium">Type d&#39;opération</Label>
              <Select
                value={formData.type_operation_id?.toString() || ""}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOperations.map(t => (
                    <SelectItem key={t.id} value={t.id.toString()}>
                      {t.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Montant et Date */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="montant" className="text-purple-700 font-medium">Montant</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="border-purple-200 focus:ring-purple-500"
                value={formData.montant || ""}
                onChange={e =>
                  setFormData({ ...formData, montant: Number.parseFloat(e.target.value) })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-purple-700 font-medium">Date opération</Label>
              <Input
                type="date"
                className="border-purple-200 focus:ring-purple-500"
                value={formData.date_operation || ""}
                onChange={e => setFormData({ ...formData, date_operation: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Mode paiement et Statut */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mode" className="text-purple-700 font-medium">Mode paiement</Label>
              <Select
                value={formData.mode_paiement || "espece"}
                onValueChange={value =>
                  setFormData({ ...formData, mode_paiement: value as Operation["mode_paiement"] })
                }
              >
                <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODE_PAIEMENT_OPTIONS.map(mode => (
                    <SelectItem key={mode} value={mode}>
                      {MODE_PAIEMENT_LABELS[mode]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="statut" className="text-purple-700 font-medium">Statut</Label>
              <Select
                value={formData.statut || "valide"}
                onValueChange={value =>
                  setFormData({ ...formData, statut: value as Operation["statut"] })
                }
              >
                <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUT_OPERATION_OPTIONS.map(statut => (
                    <SelectItem key={statut} value={statut}>
                      {STATUT_OPERATION_LABELS[statut]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section cotisation (mois) */}
          {estCotisation && (
            <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="space-y-2">
                <Label htmlFor="moisDebut" className="text-purple-700 font-medium">Mois de début</Label>
                <Input
                  type="month"
                  id="moisDebut"
                  className="border-purple-200 focus:ring-purple-500"
                  value={moisDebut}
                  onChange={e => setMoisDebut(e.target.value)}
                />
                <p className="text-xs text-purple-600">
                  Tarif mensuel estimé : {getTarifMensuel(selectedMembre) ?? "?"} Ar
                </p>
              </div>

              <MonthMultiSelect
                value={selectedMonths}
                onChange={setSelectedMonths}
                startMonth={moisDebut}
                monthsRange={48}
              />
            </div>
          )}

          {/* Référence et description */}
          <div className="space-y-2">
            <Label htmlFor="reference" className="text-purple-700 font-medium">Référence paiement</Label>
            <Input
              placeholder="Numéro de transaction ou référence"
              className="border-purple-200 focus:ring-purple-500"
              value={formData.reference_paiement || ""}
              onChange={e =>
                setFormData({ ...formData, reference_paiement: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-purple-700 font-medium">Description</Label>
            <Textarea
              placeholder="Notes supplémentaires"
              className="border-purple-200 focus:ring-purple-500"
              value={formData.description || ""}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? "Enregistrement..." : "Enregistrer l'opération"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}