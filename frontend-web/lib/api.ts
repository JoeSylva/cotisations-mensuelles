import type { Membre, Operation, SuiviCotisation, TypeOperation } from './types';

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
  getSuivi: (params?: URLSearchParams) =>
    fetchAPI<SuiviCotisation>(
      `/cotisations${params ? `?${params}` : ""}`
    ),
};