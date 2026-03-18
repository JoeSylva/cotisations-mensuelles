"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { cotisationsAPI } from "@/lib/api"
import type { SuiviCotisation } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

export default function CotisationsPage() {
  const [data, setData] = useState<SuiviCotisation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    cotisationsAPI.getSuivi()
      .then(setData)
      .catch((err) => {
        if (err.message.includes('cotisation')) {
          setError('Aucun type de cotisation trouvé. Veuillez d\'abord créer un type d\'opération de catégorie "cotisation" dans la section "Types d\'opérations".');
        } else {
          setError('Une erreur est survenue lors du chargement des données.');
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex h-screen items-center justify-center">Chargement...</div>

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="p-6 lg:p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Suivi des cotisations</h1>

          {error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration manquante</AlertTitle>
              <AlertDescription>
                {error}
                <div className="mt-4">
                  <Link href="/type-operations/new">
                    <Button variant="outline" size="sm">Créer un type de cotisation</Button>
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          ) : !data ? null : (
            <Card>
              <CardHeader>
                <CardTitle>État des cotisations par mois</CardTitle>
                <CardDescription>
                  Période du {data.mois[0]} au {data.mois[data.mois.length-1]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Membre</th>
                        {data.mois.map(m => (
                          <th key={m} className="text-center p-2">{m}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.membres.map(membre => (
                        <tr key={membre.id} className="border-b hover:bg-muted">
                          <td className="p-2 font-medium">
                            {membre.prenom} {membre.nom}
                          </td>
                          {data.mois.map(mois => {
                            const montant = membre.cotisations[mois];
                            return (
                              <td key={mois} className="text-center p-2">
                                {montant ? (
                                  <span className="text-green-600 font-medium" title={`${montant} MGA`}>
                                    ✓ {formatCurrency(montant)}
                                  </span>
                                ) : (
                                  <span className="text-red-400">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}