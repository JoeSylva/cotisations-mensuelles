import { useState, useEffect, useCallback } from 'react';
import { operationsAPI } from '@/lib/api';
import type { Operation } from '@/lib/types';

export type CreateOperationData = {
  membre_id: number;
  type_operation_id: number;
  montant: number;
  date_operation: string;
  mode_paiement: Operation['mode_paiement'];
  mois_cotisation?: string;
  description?: string;
  reference_paiement?: string;
  statut?: Operation['statut'];
};

export type UpdateOperationData = Partial<CreateOperationData>;

export function useOperations(initialFilters?: Record<string, string>) {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(initialFilters || {});

  const fetchOperations = useCallback(async () => {
    try {
        setLoading(true);
        const params = new URLSearchParams(filters);
        const result = await operationsAPI.getAll(params);
        
        // Vérifie si le résultat est un tableau
        if (Array.isArray(result)) {
        setOperations(result);
        } 
        // Sinon, suppose que c'est un objet paginé avec une propriété 'data'
        else if (result && typeof result === 'object' && 'data' in result && Array.isArray(result.data)) {
        setOperations(result.data);
        } 
        else {
        console.error('Format de réponse inattendu:', result);
        setOperations([]);
        }
        
        setError(null);
    } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
        setLoading(false);
    }
    }, [filters]); // dépend de filters

  useEffect(() => {
    fetchOperations();
  }, [fetchOperations]); // dépend de fetchOperations, qui est stable grâce à useCallback

  const createOperation = async (data: CreateOperationData) => {
    try {
      const newOp = await operationsAPI.create(data);
      setOperations((prev) => [newOp, ...prev]);
      return newOp;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la création');
    }
  };

  const updateOperation = async (id: number, data: UpdateOperationData) => {
    try {
      const updated = await operationsAPI.update(id, data);
      setOperations((prev) => prev.map((op) => (op.id === id ? updated : op)));
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la mise à jour');
    }
  };

  const deleteOperation = async (id: number) => {
    try {
      await operationsAPI.delete(id);
      setOperations((prev) => prev.filter((op) => op.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la suppression');
    }
  };

  return {
    operations,
    loading,
    error,
    filters,
    setFilters,
    fetchOperations,
    createOperation,
    updateOperation,
    deleteOperation,
  };
}