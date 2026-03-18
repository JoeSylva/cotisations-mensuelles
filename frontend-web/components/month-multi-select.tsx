"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface MonthMultiSelectProps {
  value: string[]
  onChange: (months: string[]) => void
  disabled?: boolean
}

// Génère les 12 derniers mois (format YYYY-MM)
const generateMonths = (): string[] => {
  const months = []
  const today = new Date()
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    months.push(`${year}-${month}`)
  }
  return months
}

export function MonthMultiSelect({ value, onChange, disabled }: MonthMultiSelectProps) {
  const availableMonths = generateMonths()

  const toggleMonth = (month: string) => {
    if (value.includes(month)) {
      onChange(value.filter(m => m !== month))
    } else {
      onChange([...value, month])
    }
  }

  return (
    <div className="space-y-2">
      <Label>Mois concernés</Label>
      <div className="grid grid-cols-3 gap-2">
        {availableMonths.map(month => (
          <div key={month} className="flex items-center space-x-2">
            <Checkbox
              id={month}
              checked={value.includes(month)}
              onCheckedChange={() => toggleMonth(month)}
              disabled={disabled}
            />
            <label htmlFor={month} className="text-sm cursor-pointer">
              {month}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}