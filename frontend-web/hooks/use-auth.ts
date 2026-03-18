"use client"

import { useAuthContext } from "@/contexts/auth-context"
import { getPermissions } from "@/lib/auth/permissions"

export function useAuth() {
  const { user, loading, logout, isAuthenticated } = useAuthContext()

  const permissions = user ? getPermissions(user.role) : null

  return {
    user,
    loading,
    logout,
    isAuthenticated,
    permissions,
    role: user?.role,
    hasPermission: (permission: keyof typeof permissions) => {
      if (!permissions) return false
      return permissions[permission] || false
    },
  }
}