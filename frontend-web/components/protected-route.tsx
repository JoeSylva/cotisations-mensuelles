"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

// 1️⃣ Définir toutes les permissions possibles
export type Permissions = {
  canViewDashboard: boolean;
  canManageMembers: boolean;
  canManageOperations: boolean;
  canManageTypeOperations: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
  canAccessSettings: boolean;
};

// 2️⃣ Type des clés de permissions (pour requiredPermission)
export type Permission = keyof Permissions; // "canViewDashboard" | "canManageMembers" | ...

// 3️⃣ Props du composant ProtectedRoute
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
}

// 4️⃣ Composant ProtectedRoute
export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, loading, permissions } = useAuth();
  const router = useRouter();

  // Redirection vers login si non authentifié
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-lg">Chargement...</p>
      </div>
    );
  }

  // Si pas authentifié et encore rendu (sécurité)
  if (!isAuthenticated) return null;

  // Vérification des permissions
  if (requiredPermission && !permissions?.[requiredPermission]) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>
              Vous n&#39;avez pas les permissions nécessaires pour accéder à cette page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Contactez votre administrateur pour obtenir l&#39;accès.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sinon, tout est ok
  return <>{children}</>;
}
