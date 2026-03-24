import { useState, useEffect } from 'react';
import { membresAPI } from '@/lib/api';
import type { Membre } from '@/lib/types';

export function useCurrentMember() {
  const [member, setMember] = useState<Membre | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const data = await membresAPI.getMe();
        setMember(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchMember();
  }, []);

  return { member, loading, error };
}