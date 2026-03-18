"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { TypeOperation } from "@/lib/types"
import type { CreateTypeOperationData } from "../hooks/use-type-operations"

interface TypeOperationFormProps {
  initialData?: TypeOperation
  onSubmit: (data: CreateTypeOperationData) => Promise<void>
  isLoading?: boolean
}

export function TypeOperationForm({ initialData, onSubmit, isLoading }: TypeOperationFormProps) {
  const [formData, setFormData] = useState<CreateTypeOperationData>({
    nom: initialData?.nom || "",
    description: initialData?.description || "",
    categorie: initialData?.categorie || "cotisation",
    type: initialData?.type || "credit",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? "Modifier le type" : "Nouveau type d'opération"}</CardTitle>
        <CardDescription>
          {initialData
            ? "Modifiez les informations du type d'opération"
            : "Créez un nouveau type d'opération pour les transactions"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categorie">Catégorie *</Label>
              <Select
                value={formData.categorie}
                onValueChange={(value: TypeOperation['categorie']) => setFormData({ ...formData, categorie: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cotisation">Cotisation</SelectItem>
                  <SelectItem value="don">Don</SelectItem>
                  <SelectItem value="depense">Dépense</SelectItem>
                  <SelectItem value="autres">Autres</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TypeOperation['type']) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit">Crédit (entrée)</SelectItem>
                  <SelectItem value="debit">Débit (sortie)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}