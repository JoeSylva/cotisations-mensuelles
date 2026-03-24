import { useState, useEffect } from 'react';
import { operationsAPI, typeOperationsAPI } from '@/lib/api';
import type { Operation, TypeOperation } from '@/lib/types';

export function useMemberCotisations(membreId: number | undefined) {
  const [cotisations, setCotisations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!membreId) return;

    const fetchCotisations = async () => {
      try {
        setLoading(true);
        // Récupérer tous les types de cotisation
        const allTypes = await typeOperationsAPI.getAll();
        const cotisationTypes = allTypes.filter(t => t.categorie === 'cotisation');
        const typeIds = cotisationTypes.map(t => t.id);

        if (typeIds.length === 0) {
          setCotisations([]);
          setTotal(0);
          setLoading(false);
          return;
        }

        // Récupérer les opérations du membre pour ces types
        const params = new URLSearchParams();
        params.append('membre_id', String(membreId));
        params.append('type_operation_id', typeIds.join(','));

        const result = await operationsAPI.getAll(params);
        const ops = Array.isArray(result) ? result : (result.data || []);
        setCotisations(ops);

        // Calcul du total
        const sum = ops.reduce((acc, op) => acc + Number(op.montant), 0);
        setTotal(sum);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchCotisations();
  }, [membreId]);

  return { cotisations, loading, error, total };
}