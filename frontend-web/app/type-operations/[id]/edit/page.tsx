"use client"

import { Sidebar } from "@/components/sidebar"
import { TypeOperationForm } from "../../components/type-operation-form"
import { useTypeOperations, type UpdateTypeOperationData } from "../../hooks/use-type-operations"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { TypeOperation } from "@/lib/types"
import { typeOperationsAPI } from "@/lib/api"

export default function EditTypeOperationPage() {
  const { id } = useParams()
  const router = useRouter()
  const { updateType } = useTypeOperations()
  const [typeOp, setTypeOp] = useState<TypeOperation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      typeOperationsAPI.getOne(Number(id))
        .then(setTypeOp)
        .catch(() => router.push("/type-operations"))
        .finally(() => setLoading(false))
    }
  }, [id, router])

  const handleSubmit = async (data: UpdateTypeOperationData) => {
    try {
      await updateType(Number(id), data)
      router.push("/type-operations")
    } catch{
      alert("Erreur lors de la mise à jour")
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center bg-purple-100">Chargement...</div>
  if (!typeOp) return null

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64  bg-purple-100">
        <div className="p-6 lg:p-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/type-operations">
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-purple-900">Modifier le type d&#39;opération</h1>
              <p className="text-purple-700 mt-1">Modifiez les informations du type</p>
            </div>
          </div>

          <TypeOperationForm initialData={typeOp} onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  )
}