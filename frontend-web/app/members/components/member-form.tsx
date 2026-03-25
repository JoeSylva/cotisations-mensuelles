"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Membre } from "@/lib/types"

export type MemberFormData = {
  nom: string
  prenom: string
  email: string
  telephone: string
  date_naissance: string
  adresse: string
  profession: string
  statut: Membre['statut']
  situation_matrimoniale: string
}

interface MemberFormProps {
  initialData?: Partial<Membre>
  onSubmit: (data: MemberFormData) => Promise<void>
  isLoading?: boolean
}

export function MemberForm({ initialData, onSubmit, isLoading }: MemberFormProps) {
  const [formData, setFormData] = useState<MemberFormData>({
    nom: initialData?.user?.nom || "",
    prenom: initialData?.user?.prenom || "",
    email: initialData?.user?.email || "",
    telephone: initialData?.user?.telephone || "",
    date_naissance: initialData?.date_naissance ? initialData.date_naissance.split('T')[0] : "",
    adresse: initialData?.adresse || "",
    profession: initialData?.profession || "",
    statut: initialData?.statut || "actif",
    situation_matrimoniale: initialData?.situation_matrimoniale || "célibataire",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <Card className="border-purple-200 shadow-md">
      <CardHeader className="bg-purple-50 border-b border-purple-200">
        <CardTitle className="text-blue-900 font-bold">
          {initialData ? "Modifier le membre" : "Nouveau membre"}
        </CardTitle>
        <CardDescription className="text-purple-600">
          {initialData ? "Modifiez les informations du membre" : "Remplissez les informations pour créer un nouveau membre"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-blue-700 font-medium">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="border-purple-200 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom" className="text-blue-700 font-medium">Prénom *</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                className="border-purple-200 focus:ring-purple-500"
              />
            </div>           
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-700 font-medium">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-purple-200 focus:ring-purple-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone" className="text-blue-700 font-medium">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="border-purple-200 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_naissance" className="text-blue-700 font-medium">Date de naissance</Label>
              <Input
                id="date_naissance"
                type="date"
                value={formData.date_naissance}
                onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                className="border-purple-200 focus:ring-purple-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profession" className="text-blue-700 font-medium">Profession</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                className="border-purple-200 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="situation_matrimoniale" className="text-blue-700 font-medium">Situation matrimoniale *</Label>
            <Select
              value={formData.situation_matrimoniale}
              onValueChange={(value) => setFormData({ ...formData, situation_matrimoniale: value })}
            >
              <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="célibataire">Célibataire</SelectItem>
                <SelectItem value="marié">Marié(e)</SelectItem>
                <SelectItem value="divorcé">Divorcé(e)</SelectItem>
                <SelectItem value="veuf">Veuf/Veuve</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="adresse" className="text-blue-700 font-medium">Adresse</Label>
            <Textarea
              id="adresse"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              rows={3}
              className="border-purple-200 focus:ring-purple-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="statut" className="text-blue-700 font-medium">Statut</Label>
            <Select
              value={formData.statut}
              onValueChange={(value: Membre['statut']) => setFormData({ ...formData, statut: value })}
            >
              <SelectTrigger className="border-purple-200 focus:ring-purple-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
                <SelectItem value="suspendu">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white">
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}