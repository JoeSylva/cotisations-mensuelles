// hooks/use-type-operations.ts
import { useState, useEffect, useCallback } from 'react';
import { typeOperationsAPI } from '@/lib/api';
import type { TypeOperation } from '@/lib/types';

export type CreateTypeOperationData = {
  nom: string;
  categorie: TypeOperation['categorie'];
  type: TypeOperation['type'];
  description?: string;
};

export type UpdateTypeOperationData = Partial<CreateTypeOperationData>;

export function useTypeOperations(filters?: Record<string, string>) {
  const [typeOperations, setTypeOperations] = useState<TypeOperation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTypeOperations = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const data = await typeOperationsAPI.getAll(params);
      setTypeOperations(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTypeOperations();
  }, [fetchTypeOperations]);

  const createType = async (data: CreateTypeOperationData) => {
    try {
      const newType = await typeOperationsAPI.create(data);
      setTypeOperations((prev) => [...prev, newType]);
      return newType;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la création');
    }
  };

  const updateType = async (id: number, data: UpdateTypeOperationData) => {
    try {
      const updated = await typeOperationsAPI.update(id, data);
      setTypeOperations((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la mise à jour');
    }
  };

  const deleteType = async (id: number) => {
    try {
      await typeOperationsAPI.delete(id);
      setTypeOperations((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la suppression');
    }
  };

  return {
    typeOperations,
    loading,
    error,
    fetchTypeOperations,
    createType,
    updateType,
    deleteType,
  };
}