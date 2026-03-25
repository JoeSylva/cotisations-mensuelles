"use client"

import { useAuthContext } from "@/contexts/auth-context"
import { getPermissions } from "@/lib/auth/permissions"
import type { UserRole } from "@/lib/auth/permissions"

export function useAuth() {
  const { user, loading, logout, isAuthenticated, updateUser } = useAuthContext()

  // Retourne toujours un objet, même si user est null
  const permissions = user ? getPermissions(user.role as UserRole) : {}

  return {
    user,
    loading,
    logout,
    isAuthenticated,
    permissions,
    role: user?.role,
    updateUser,
    hasPermission: (permission: string) => {
      // @ts-expect-error – permissions est un objet avec les clés possibles
      return permissions[permission] || false
    },
  }
}