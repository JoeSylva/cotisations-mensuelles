"use client"

import { Sidebar } from "@/components/sidebar"
import { MemberForm, MemberFormData } from "../components/member-form"
import { useMembres } from "../hooks/use-membres"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Membre } from "@/lib/types"
import { membresAPI } from "@/lib/api"

export default function EditMemberPage() {
  const { id } = useParams()
  const router = useRouter()
  const { updateMembre } = useMembres()
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

  const handleSubmit = async (data: MemberFormData) => {
    try {
      await updateMembre(Number(id), data)
      router.push("/members")
    } catch {
      alert("Erreur lors de la mise à jour")
    }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-purple-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  )
  if (!membre) return null

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64 bg-purple-100">
        <div className="p-6 lg:p-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/members">
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-purple-900">Modifier le membre</h1>
              <p className="text-purple-700 mt-1">Modifiez les informations du membre</p>
            </div>
          </div>

          <MemberForm initialData={membre} onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  )
}