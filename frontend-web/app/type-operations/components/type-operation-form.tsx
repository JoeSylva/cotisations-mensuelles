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
    <Card className="border-purple-200 shadow-md">
      <CardHeader className="bg-purple-50 border-b border-purple-200">
        <CardTitle className="text-purple-800">
          {initialData ? "Modifier le type" : "Nouveau type d'opération"}
        </CardTitle>
        <CardDescription className="text-purple-600">
          {initialData
            ? "Modifiez les informations du type d'opération"
            : "Créez un nouveau type d'opération pour les transactions"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nom" className="text-purple-700 font-medium">Nom *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="border-purple-200 focus:ring-purple-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-purple-700 font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="border-purple-200 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categorie" className="text-purple-700 font-medium">Catégorie *</Label>
              <Select
                value={formData.categorie}
                onValueChange={(value: TypeOperation['categorie']) => setFormData({ ...formData, categorie: value })}
              >
                <SelectTrigger className="border-purple-200 focus:ring-purple-500">
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
              <Label htmlFor="type" className="text-purple-700 font-medium">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: TypeOperation['type']) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="border-purple-200 focus:ring-purple-500">
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
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}