import { useState, useEffect } from 'react';
import { dashboardAPI } from '@/lib/api';

export interface MonthlyData {
  month: string;
  revenus: number;
  depenses: number;
}

export function useMonthlyEvolution(year?: number) {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await dashboardAPI.getMonthlyEvolution(year);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year]);

  return { data, loading, error };
}