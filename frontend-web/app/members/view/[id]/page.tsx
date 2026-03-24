"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Briefcase, User, Users } from "lucide-react"
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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-100">
        <div className="text-purple-600">Chargement...</div>
      </div>
    )
  }
  if (!membre) return null

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64  bg-purple-100">
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
          {/* Header avec retour */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/members">
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-purple-900">Profil Membre</h1>
              <p className="text-gray-700 mt-1">Informations détaillées du membre</p>
            </div>
          </div>

          {/* Grille principale */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Carte latérale - informations synthétiques */}
            <Card className="border-purple-200 shadow-md">
              <CardHeader className="bg-purple-50 border-b border-purple-200">
                <CardTitle className="text-gray-800">Informations</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-3xl font-bold mx-auto border-2 border-purple-200">
                  {membre.prenom[0]}{membre.nom[0]}
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-purple-900">
                    {membre.prenom} {membre.nom}
                  </h3>
                  <p className="text-sm text-purple-600">ID: MEM-{String(membre.id).padStart(3, '0')}</p>
                </div>
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-600">Statut</span>
                    <span
                      className={`font-medium px-2 py-1 rounded ${
                        membre.statut === "actif"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {membre.statut === "actif" ? "Actif" : membre.statut}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-600">Rôle</span>
                    <span className="font-medium text-gray-800">
                      {membre.user?.role === "admin" ? "Admin" : "Membre"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-600">Adhésion</span>
                    <span className="font-medium text-gray-800">
                      {formatDate(membre.date_adhesion)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détails complets */}
            <Card className="lg:col-span-2 border-purple-200 shadow-md">
              <CardHeader className="bg-purple-50 border-b border-purple-200">
                <CardTitle className="text-gray-800">Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <User className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-purple-600">Prénom</p>
                      <p className="font-medium text-gray-900">{membre.prenom}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <User className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-purple-600">Nom</p>
                      <p className="font-medium text-gray-900">{membre.nom}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-purple-600">Email</p>
                    <p className="font-medium text-gray-900">{membre.user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Phone className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-purple-600">Téléphone</p>
                      <p className="font-medium text-gray-900">
                        {membre.user?.telephone || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-purple-600">Date de naissance</p>
                      <p className="font-medium text-gray-900">
                        {membre.date_naissance ? formatDate(membre.date_naissance) : "Non renseignée"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-purple-600">Adresse</p>
                    <p className="font-medium text-gray-900">
                      {membre.adresse || "Non renseignée"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Briefcase className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-purple-600">Profession</p>
                      <p className="font-medium text-gray-900">
                        {membre.profession || "Non renseignée"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-purple-600">Situation matrimoniale</p>
                      <p className="font-medium text-gray-900">
                        {membre.situation_matrimoniale ? (
                          membre.situation_matrimoniale === "célibataire" ? "Célibataire" :
                          membre.situation_matrimoniale === "marié" ? "Marié(e)" :
                          membre.situation_matrimoniale === "divorcé" ? "Divorcé(e)" :
                          membre.situation_matrimoniale === "veuf" ? "Veuf/Veuve" : membre.situation_matrimoniale
                        ) : "Non renseignée"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-purple-100">
                  <Link href={`/members/${membre.id}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                      <Edit className="w-4 h-4" />
                      Modifier
                    </Button>
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