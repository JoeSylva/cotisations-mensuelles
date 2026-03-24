"use client"

import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { cotisationsAPI } from "@/lib/api"
import type { SuiviCotisation } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CotisationsPage() {
  const [data, setData] = useState<SuiviCotisation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({ annee: "", debut: "", fin: "" })

  const years = useMemo(() => {
    if (!data?.mois) return []
    const uniqueYears = [...new Set(data.mois.map(m => m.split("-")[0]))].sort()
    return uniqueYears
  }, [data])

  // Chargement initial (une seule fois)
  useEffect(() => {
    let isMounted = true
    const fetchInitialData = () => {
      if (!isMounted) return
      setLoading(true)
      cotisationsAPI.getSuivi()
        .then((result) => {
          if (isMounted) {
            setData(result)
            setError(null)
          }
        })
        .catch((err) => {
          if (isMounted) {
            if (err.message?.includes('cotisation')) {
              setError('Aucun type de cotisation trouvé. Veuillez d\'abord créer un type d\'opération de catégorie "cotisation" dans la section "Types d\'opérations".')
            } else {
              setError('Une erreur est survenue lors du chargement des données.')
            }
            setData(null)
          }
        })
        .finally(() => {
          if (isMounted) setLoading(false)
        })
    }
    fetchInitialData()
    return () => { isMounted = false }
  }, [])

  const handleYearFilter = (year: string) => {
    if (year && year !== "all") {
      const debut = `${year}-01`
      const fin = `${year}-12`
      setLoading(true)
      cotisationsAPI.getSuivi({ debut, fin })
        .then(setData)
        .catch((err) => {
          if (err.message?.includes('cotisation')) {
            setError('Aucun type de cotisation trouvé.')
          } else {
            setError('Une erreur est survenue.')
          }
        })
        .finally(() => setLoading(false))
      setFilters({ annee: year, debut, fin })
    } else {
      setLoading(true)
      cotisationsAPI.getSuivi()
        .then(setData)
        .catch((err) => {
          if (err.message?.includes('cotisation')) {
            setError('Aucun type de cotisation trouvé.')
          } else {
            setError('Une erreur est survenue.')
          }
        })
        .finally(() => setLoading(false))
      setFilters({ annee: "", debut: "", fin: "" })
    }
  }

  const handleCustomRange = (e: React.FormEvent) => {
    e.preventDefault()
    if (filters.debut && filters.fin) {
      setLoading(true)
      cotisationsAPI.getSuivi({ debut: filters.debut, fin: filters.fin })
        .then(setData)
        .catch((err) => {
          if (err.message?.includes('cotisation')) {
            setError('Aucun type de cotisation trouvé.')
          } else {
            setError('Une erreur est survenue.')
          }
        })
        .finally(() => setLoading(false))
    }
  }

  const resetFilters = () => {
    setFilters({ annee: "", debut: "", fin: "" })
    setLoading(true)
    cotisationsAPI.getSuivi()
      .then(setData)
      .catch((err) => {
        if (err.message?.includes('cotisation')) {
          setError('Aucun type de cotisation trouvé.')
        } else {
          setError('Une erreur est survenue.')
        }
      })
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-100">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto lg:ml-64 bg-purple-100">
        <div className="p-6 lg:p-8">
          {/* Titre */}
          <h1 className="text-3xl font-bold text-purple-900 mb-6">Suivi des cotisations</h1>

          {/* Filtres - placés verticalement sous le titre */}
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="space-y-1">
                <Label className="text-purple-700">Filtrer par année</Label>
                <Select value={filters.annee} onValueChange={handleYearFilter}>
                  <SelectTrigger className="w-full border-purple-200 focus:ring-purple-500">
                    <SelectValue placeholder="Toutes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {years.map(y => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <form onSubmit={handleCustomRange} className="flex gap-2 col-span-2 items-end">
                <div className="space-y-1 flex-1">
                  <Label className="text-purple-700">Début</Label>
                  <Input
                    type="month"
                    value={filters.debut}
                    onChange={e => setFilters({ ...filters, debut: e.target.value })}
                    className="w-full border-purple-200 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-1 flex-1">
                  <Label className="text-purple-700">Fin</Label>
                  <Input
                    type="month"
                    value={filters.fin}
                    onChange={e => setFilters({ ...filters, fin: e.target.value })}
                    className="w-full border-purple-200 focus:ring-purple-500"
                  />
                </div>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  Appliquer
                </Button>
              </form>
              <div>
                <Button
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                  onClick={resetFilters}
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </div>

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
            <Card className="border-purple-200 shadow-md">
              <CardHeader className="bg-purple-50 border-b border-purple-200">
                <CardTitle className="text-gray-900">État des cotisations par mois</CardTitle>
                <CardDescription className="text-gray-500">
                  Période du {data.mois[0]} au {data.mois[data.mois.length - 1]}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-purple-200">
                        <th className="text-left p-2 text-purple-700">Membre</th>
                        {data.mois.map(m => (
                          <th key={m} className="text-center p-2 text-purple-700">{m}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.membres.map(membre => (
                        <tr key={membre.id} className="border-b border-purple-100 hover:bg-purple-50">
                          <td className="p-2 font-medium text-gray-900">
                            {membre.prenom} {membre.nom}
                          </td>
                          {data.mois.map(mois => {
                            const montant = membre.cotisations[mois]
                            return (
                              <td key={mois} className="text-center p-2">
                                {montant ? (
                                  <span className="text-green-600 font-medium" title={`${montant} Ar`}>
                                    ✓ {formatCurrency(montant)}
                                  </span>
                                ) : (
                                  <span className="text-red-400">–</span>
                                )}
                              </td>
                            )
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