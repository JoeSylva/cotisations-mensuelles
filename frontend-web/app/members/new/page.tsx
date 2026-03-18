"use client"

import { Sidebar } from "@/components/sidebar"
import { MemberForm, type MemberFormData } from "../components/member-form"
import { useMembres } from "../hooks/use-membres"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewMemberPage() {
  const { createMembre } = useMembres()
  const router = useRouter()

  const handleSubmit = async (data: MemberFormData) => {
    try {
      await createMembre(data)
      router.push("/members")
    } catch {
      alert("Erreur lors de la création du membre")
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-6 lg:p-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/members">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Nouveau membre</h1>
              <p className="text-muted-foreground mt-1">Ajoutez un nouveau membre à l&#39;association</p>
            </div>
          </div>

          <MemberForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  )
}