import { useState, useEffect } from 'react';
import { membresAPI } from '@/lib/api';
import type { Membre } from '@/lib/types';

export function useMembres() {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembres = async () => {
    try {
      setLoading(true);
      const data = await membresAPI.getAll();
      setMembres(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembres();
  }, []);

  const createMembre = async (data: Parameters<typeof membresAPI.create>[0]) => {
    try {
      const newMembre = await membresAPI.create(data);
      setMembres((prev) => [newMembre, ...prev]);
      return newMembre;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la création');
    }
  };

  const updateMembre = async (id: number, data: Parameters<typeof membresAPI.update>[1]) => {
    try {
      const updated = await membresAPI.update(id, data);
      setMembres((prev) => prev.map((m) => (m.id === id ? updated : m)));
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la mise à jour');
    }
  };

  const deleteMembre = async (id: number) => {
    try {
      await membresAPI.delete(id);
      setMembres((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Erreur lors de la suppression');
    }
  };

  return {
    membres,
    loading,
    error,
    fetchMembres,
    createMembre,
    updateMembre,
    deleteMembre,
  };
}