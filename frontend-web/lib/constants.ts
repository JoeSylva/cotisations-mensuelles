export const ROLE_OPTIONS = ["admin", "tresorier", "membre"] as const
export const STATUT_MEMBRE_OPTIONS = ["actif", "inactif"] as const
export const CATEGORIE_OPTIONS = ["cotisation", "don", "depense", "autres"] as const
export const TYPE_OPERATION_OPTIONS = ["debit", "credit"] as const
export const MODE_PAIEMENT_OPTIONS = ["espece", "mobile_money"] as const
export const STATUT_OPERATION_OPTIONS = ["valide", "annule", "en_attente"] as const

export const ROLE_LABELS = {
  admin: "Administrateur",
  tresorier: "Trésorier",
  membre: "Membre",
} as const

export const STATUT_LABELS = {
  actif: "Actif",
  inactif: "Inactif",
} as const

export const CATEGORIE_LABELS = {
  cotisation: "Cotisation",
  don: "Don",
  depense: "Dépense",
  autres: "Autres",
} as const

export const MODE_PAIEMENT_LABELS = {
  espece: "Espèce",
  mobile_money: "Mobile Money",
} as const

export const STATUT_OPERATION_LABELS = {
  valide: "Validée",
  annule: "Annulée",
  en_attente: "En attente",
} as const
