import { useState, useEffect } from 'react';
import { dashboardAPI } from '@/lib/api';
import { Operation } from '@/lib/types';

export interface DashboardStats {
  solde_total: number;
  nombre_membres: number;
  stats_categories: Array<{ categorie: string; sens: string; total: number }>;
  dernieres_operations: Operation[];
  periode: { debut: string; fin: string };
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getStats();
        // Transformer 'type' en 'sens' pour la compatibilité
        const mapped = {
          ...data,
          stats_categories: data.stats_categories.map(
            (cat: { categorie: string; type: string; total: number }) => ({
              ...cat,
              sens: cat.type,
            })
          ),
        };
        setStats(mapped);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return { stats, loading, error };
}