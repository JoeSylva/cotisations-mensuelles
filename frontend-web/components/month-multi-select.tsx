// components/month-multi-select.tsx
import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns"; // ou votre propre fonction

interface MonthMultiSelectProps {
  value: string[]; // mois sélectionnés au format "YYYY-MM"
  onChange: (months: string[]) => void;
  startMonth?: string; // mois de début pour le scroll et la génération
  monthsRange?: number; // nombre total de mois à afficher (par défaut 48)
}

export function MonthMultiSelect({
  value,
  onChange,
  startMonth = new Date().toISOString().slice(0, 7),
  monthsRange = 48,
}: MonthMultiSelectProps) {
  const [months, setMonths] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const startMonthRef = useRef<HTMLDivElement>(null);

  // Générer une liste de mois centrée autour du startMonth
  useEffect(() => {
    const startDate = new Date(startMonth + "-01");
    const halfRange = Math.floor(monthsRange / 2);
    const firstMonth = new Date(startDate);
    firstMonth.setMonth(startDate.getMonth() - halfRange);

    const generatedMonths: string[] = [];
    for (let i = 0; i < monthsRange; i++) {
      const date = new Date(firstMonth);
      date.setMonth(firstMonth.getMonth() + i);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      generatedMonths.push(yearMonth);
    }
    setMonths(generatedMonths);
  }, [startMonth, monthsRange]);

  // Scroll jusqu'au mois de début
  useEffect(() => {
    if (startMonthRef.current) {
      startMonthRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [months]);

  const handleCheck = (month: string, checked: boolean) => {
    if (checked) {
      onChange([...value, month]);
    } else {
      onChange(value.filter((m) => m !== month));
    }
  };

  return (
    <div className="space-y-2">
      <Label>Mois concernés</Label>
      <ScrollArea className="h-64 rounded-md border p-2">
        <div className="space-y-2">
          {months.map((month) => (
            <div
              key={month}
              ref={month === startMonth ? startMonthRef : null}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id={month}
                checked={value.includes(month)}
                onCheckedChange={(checked) => handleCheck(month, checked === true)}
              />
              <Label htmlFor={month} className="cursor-pointer">
                {format(new Date(month + "-01"), "MMMM yyyy")}
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}