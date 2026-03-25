import type { DashboardStats, Membre, Operation, SuiviCotisation, TypeOperation, User } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Une erreur est survenue");
  }

  return response.json();
}

// Types pour la création d'un membre
export type CreateMembreData = {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  date_naissance?: string;
  adresse?: string;
  profession?: string;
};

// API Membres
export const membresAPI = {
  getAll: () => fetchAPI<Membre[]>("/membres"),
  getOne: (id: number) => fetchAPI<Membre>(`/membres/${id}`),
  getMe: () => fetchAPI<Membre>("/me"),
  create: (data: CreateMembreData) =>
    fetchAPI<Membre>("/membres", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Membre>) =>
    fetchAPI<Membre>(`/membres/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI<void>(`/membres/${id}`, { method: "DELETE" }),
};

// API Opérations
export const operationsAPI = {
  getAll: (params?: URLSearchParams) =>
    fetchAPI<Operation[] | { data: Operation[]; total?: number; current_page?: number }>(
      `/operations${params ? `?${params}` : ""}`
    ),
  getOne: (id: number) => fetchAPI<Operation>(`/operations/${id}`),
  create: (data: Partial<Operation>) =>
    fetchAPI<Operation>("/operations", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Operation>) =>
    fetchAPI<Operation>(`/operations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI<void>(`/operations/${id}`, { method: "DELETE" }),
};

// API Types d'opérations
export const typeOperationsAPI = {
  getAll: (params?: URLSearchParams) =>
    fetchAPI<TypeOperation[]>(`/type-operations${params ? `?${params}` : ""}`),
  getOne: (id: number) => fetchAPI<TypeOperation>(`/type-operations/${id}`),
  create: (data: Partial<TypeOperation>) =>
    fetchAPI<TypeOperation>("/type-operations", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<TypeOperation>) =>
    fetchAPI<TypeOperation>(`/type-operations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) => fetchAPI<void>(`/type-operations/${id}`, { method: "DELETE" }),
  getByCategory: (category: string) =>
    fetchAPI<TypeOperation[]>(`/type-operations/category/${category}`),
  getByType: (type: "credit" | "debit") =>
    fetchAPI<TypeOperation[]>(`/type-operations/type/${type}`),
};

// API Cotisations
export const cotisationsAPI = {
  getSuivi: (params?: { debut?: string; fin?: string }) => {
    let query = "";
    if (params && (params.debut || params.fin)) {
      const searchParams = new URLSearchParams();
      if (params.debut) searchParams.append("debut", params.debut);
      if (params.fin) searchParams.append("fin", params.fin);
      query = `?${searchParams.toString()}`;
    }
    return fetchAPI<SuiviCotisation>(`/cotisations${query}`);
  },
};

export const dashboardAPI = {
  getStats: () => fetchAPI<{
    solde_total: number;
    nombre_membres: number;
    stats_categories: Array<{ categorie: string; type: string; total: number }>;
    dernieres_operations: Operation[];
    periode: { debut: string; fin: string };
  }>('/dashboard/statistiques'),
  getSolde: () => fetchAPI<{ solde: number }>('/dashboard/solde'),
  getMonthlyEvolution: (year?: number) => {
    const params = year ? `?year=${year}` : '';
    return fetchAPI<Array<{ month: string; revenus: number; depenses: number }>>(`/dashboard/monthly-evolution${params}`);
  },
};

export const userAPI = {
  updateProfile: (data: { nom: string; prenom: string; email: string; telephone?: string }) =>
    fetchAPI<User>('/user', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data: { current_password: string; new_password: string; new_password_confirmation: string }) =>
    fetchAPI<{ message: string }>('/user/change-password', { method: 'POST', body: JSON.stringify(data) }),
};
// export const dashboardAPI = {
//   getStats: () => fetchAPI<DashboardStats>('/dashboard/statistiques'),
//   getSolde: () => fetchAPI<{ solde: number }>('/dashboard/solde'),
// };

