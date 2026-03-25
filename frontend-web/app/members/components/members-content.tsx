"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import { useMembres } from "../hooks/use-membres"
import { useState } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"

export default function MembersContent() {
  const { membres, loading, error, deleteMembre } = useMembres()
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const filteredMembres = membres.filter((m) =>
    `${m.prenom} ${m.nom} ${m.user?.email} ${m.telephone} ${m.date_naissance} ${m.adresse} ${m.profession} ${m.situation_matrimoniale}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      try {
        await deleteMembre(id)
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

      <main className="flex-1 overflow-auto bg-purple-100 lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Gestion des Membres</h1>
              <p className="text-muted-purple-700 mt-1">Gérez tous les membres de votre association</p>
            </div>
            <Link href="/members/new">
              <Button className="gap-2 bg-green-500 hover:bg-green-600 text-white">
                <Plus className="w-4 h-4" />
                Nouveau Membre
              </Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-6 bg-white rounded-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-12 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par nom, email..."
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Members Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900 font-bold">Liste des Membres</CardTitle>
              <CardDescription className="text-purple-600">Total: {filteredMembres.length} membre(s)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">Nom</th>
                      <th className="text-left p-3 font-semibold">Situation matrimoniale</th>
                      <th className="text-left p-3 font-semibold">Téléphone</th>
                      <th className="text-left p-3 font-semibold">Rôle</th>
                      <th className="text-left p-3 font-semibold">Date de naissance</th>
                      <th className="text-left p-3 font-semibold">Adhésion</th>
                      <th className="text-center p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-purple-200">
                    {filteredMembres.map((member) => (
                      <tr key={member.id} className="border-b border-border hover:bg-muted">
                        <td className="p-3 font-medium">
                          {member.user?.prenom} {member.user?.nom}
                        </td>
                        <td className="p-3 text-muted-foreground">{member.situation_matrimoniale}</td>
                        <td className="p-3">{member.user?.telephone}</td>
                        <td className="p-3">
                          <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {member.user?.role === 'admin' ? 'Admin' : 'Membre'}
                          </span>
                        </td>
                        <td className="p-3">{member.date_naissance ?formatDate(member.date_naissance):"N/A"}</td>
                        {/* <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.statut === 'actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {member.statut}
                          </span>
                        </td> */}
                        <td className="p-3 text-muted-foreground">{formatDate(member.date_adhesion)}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/members/view/${member.id}`)}>
                              <Eye className="w-4 h-4 text-green-500" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/members/${member.id}`)}>
                              <Edit className="w-4 h-4 text-blue-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(member.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}