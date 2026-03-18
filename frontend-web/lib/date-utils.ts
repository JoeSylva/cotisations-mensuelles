/**
 * Génère une liste de mois au format YYYY-MM à partir d'un mois de début et d'un nombre de mois.
 * @param startMonth Mois de début (format YYYY-MM)
 * @param count Nombre de mois à générer
 * @returns Tableau de mois (ex: ["2026-03", "2026-04", ...])
 */
export function generateMonthsFrom(startMonth: string, count: number): string[] {
  const [year, month] = startMonth.split('-').map(Number);
  const months: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(year, month - 1 + i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    months.push(`${y}-${m}`);
  }
  return months;
}