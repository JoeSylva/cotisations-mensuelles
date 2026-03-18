"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { membresAPI } from "@/lib/api"
import type { Membre } from "@/lib/types"
import { formatDate } from "@/lib/utils"

export default function MemberViewPage() {
  const { id } = useParams()
  const router = useRouter()
  const [membre, setMembre] = useState<Membre | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      membresAPI.getOne(Number(id))
        .then(setMembre)
        .catch(() => router.push("/members"))
        .finally(() => setLoading(false))
    }
  }, [id, router])

  if (loading) return <div className="flex h-screen items-center justify-center">Chargement...</div>
  if (!membre) return null

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-6 lg:p-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/members">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profil Membre</h1>
              <p className="text-muted-foreground mt-1">Informations du membre</p>
            </div>
          </div>

          {/* Member Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mx-auto">
                  {membre.prenom[0]}{membre.nom[0]}
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg">{membre.prenom} {membre.nom}</h3>
                  <p className="text-sm text-muted-foreground">ID: MEM-{String(membre.id).padStart(3, '0')}</p>
                </div>
                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Statut</span>
                    <span className={`font-medium px-2 py-1 rounded ${membre.statut === 'actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {membre.statut}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Rôle</span>
                    <span className="font-medium">{membre.user?.role === 'admin' ? 'Admin' : 'Membre'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Adhésion</span>
                    <span className="font-medium">{formatDate(membre.date_adhesion)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détails en lecture seule */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Prénom</p>
                    <p className="font-medium">{membre.prenom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{membre.nom}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{membre.user?.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{membre.user?.telephone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date de naissance</p>
                    <p className="font-medium">{membre.date_naissance ? formatDate(membre.date_naissance) : "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="font-medium">{membre.adresse || "N/A"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Profession</p>
                    <p className="font-medium">{membre.profession || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Situation matrimoniale</p>
                    <p className="font-medium">{membre.situation_matrimoniale || "N/A"}</p>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Link href={`/members/${membre.id}`}>
                    <Button variant="outline">Modifier</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}