export type UserRole = "admin" | "tresorier" | "membre"

export const PERMISSIONS = {
  admin: {
    canViewDashboard: true,
    canManageMembers: true,
    canManageOperations: true,
    canManageTypeOperations: true,
    canViewCotisations: true,
    canViewReports: true,
    canManageUsers: true,
    canAccessSettings: true,
  },
  tresorier: {
    canViewDashboard: true,
    canManageMembers: false,
    canManageOperations: true,
    canManageTypeOperations: true,
    canViewCotisations: true,
    canViewReports: true,
    canManageUsers: false,
    canAccessSettings: false,
  },
  membre: {
    canViewDashboard: true,
    canManageMembers: false,
    canManageOperations: false,
    canManageTypeOperations: false,
    canViewCotisations: true,
    canViewReports: false,
    canManageUsers: false,
    canAccessSettings: false,
  },
}

export const getPermissions = (role: UserRole) => PERMISSIONS[role]

export const hasPermission = (role: UserRole, permission: keyof (typeof PERMISSIONS)[UserRole]): boolean => {
  return PERMISSIONS[role][permission] as boolean
}