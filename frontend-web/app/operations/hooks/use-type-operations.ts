import { useState, useEffect } from 'react'
import { typeOperationsAPI } from '@/lib/api'
import type { TypeOperation } from '@/lib/types'

export function useTypeOperations() {
  const [typeOperations, setTypeOperations] = useState<TypeOperation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    typeOperationsAPI.getAll()
      .then(setTypeOperations)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { typeOperations, loading }
}