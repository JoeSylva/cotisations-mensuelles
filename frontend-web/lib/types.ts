export interface User {
  id: number
  uuid: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  role: "admin" | "tresorier" | "membre"
  password: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

export interface Membre {
  id: number
  user_id: number
  nom: string
  prenom: string
  telephone?: string
  date_naissance?: string
  adresse?: string
  situation_matrimoniale?: string
  profession?: string
  date_adhesion: string
  statut: "actif" | "inactif"
  photo_url?: string
  created_at: string
  updated_at: string
  user?: User // ← ajouté pour la relation
}

export interface TypeOperation {
  id: number
  nom: string
  description?: string
  categorie: "cotisation" | "don" | "depense" | "autres"
  type: "debit" | "credit"
  created_at: string
  updated_at: string
}

export interface Operation {
  id: number
  uuid: string
  membre_id: number
  type_operation_id: number
  montant: number
  date_operation: string
  mois_cotisation?: string
  description?: string
  mode_paiement: "espece" | "mobile_money"
  reference_paiement?: string
  statut: "valide" | "annule" | "en_attente"
  created_by: number
  created_at: string
  updated_at: string
  membre?: Membre
  type_operation?: TypeOperation
  created_by_user?: User
}

export interface DashboardStats {
  total_membres: number
  membres_actifs: number
  total_cotisations: number
  total_depenses: number
  solde_general: number
  derniers_mois: {
    mois: string
    revenus: number
    depenses: number
  }[]
}

export interface SuiviMembre {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  date_adhesion: string;
  cotisations: Record<string, number | null>;
}

export interface SuiviCotisation {
  mois: string[];
  membres: SuiviMembre[];
}