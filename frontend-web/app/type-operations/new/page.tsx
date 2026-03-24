"use client"

import { Sidebar } from "@/components/sidebar"
import { TypeOperationForm } from "../components/type-operation-form"
import { useTypeOperations, type CreateTypeOperationData } from "../hooks/use-type-operations"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewTypeOperationPage() {
  const { createType } = useTypeOperations()
  const router = useRouter()

  const handleSubmit = async (data: CreateTypeOperationData) => {
    try {
      await createType(data)
      router.push("/type-operations")
    } catch {
      alert("Erreur lors de la création du type d'opération")
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64 bg-purple-100">
        <div className="p-6 lg:p-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/type-operations">
              <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-purple-900">Nouveau type d&#39;opération</h1>
              <p className="text-purple-700 mt-1">Créez un nouveau type pour les transactions</p>
            </div>
          </div>

          <TypeOperationForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  )
}