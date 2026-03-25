"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from "@/components/sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, DollarSign, User, Mail, Phone } from "lucide-react";
import { useCurrentMember } from "@/app/members/hooks/useCurrentMember";
import { useMemberCotisations } from "@/app/members/hooks/useMemberCotisations";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function MemberDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { member, loading: memberLoading, error: memberError } = useCurrentMember();
  const { cotisations, loading: cotisationsLoading, total } = useMemberCotisations(member?.id);

  useEffect(() => {
    if (!memberLoading && !member && user) {
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      }
    }
  }, [memberLoading, member, user, router]);

  if (memberLoading || cotisationsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (memberError) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-100">
        <p className="text-red-600">Erreur : {memberError}</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex h-screen items-center justify-center bg-purple-100">
        <p className="text-gray-600">Aucune fiche membre associée à ce compte.</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-purple-100">
        <Sidebar />
        <main className="flex-1 overflow-auto lg:ml-64">
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-900">Mon Espace</h1>
              <p className="text-purple-700 mt-1">
                Bienvenue {member.user?.prenom} {member.user?.nom}
              </p>
            </div>

            {/* Profile Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2 border-purple-200 shadow-md">
                <CardHeader className="bg-purple-50 border-b border-purple-200">
                  <CardTitle className="text-blue-900">Mon Profil</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                      <User className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-blue-900">
                        {member.user?.prenom} {member.user?.nom}
                      </p>
                      <p className="text-sm text-purple-600">
                        Membre depuis {member.date_adhesion ? formatDate(member.date_adhesion) : "Non renseigné"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-purple-200">
                    <div>
                      <p className="text-sm text-purple-600">Email</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <p className="font-medium text-gray-800">{member.user?.email}</p>
                      </div>
                    </div>
                    {member.user?.telephone && (
                      <div>
                        <p className="text-sm text-purple-600">Téléphone</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-purple-500" />
                          <p className="font-medium text-gray-800">{member.user.telephone}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {member.situation_matrimoniale && (
                    <div className="pt-2">
                      <p className="text-sm text-purple-600">Situation matrimoniale</p>
                      <p className="font-medium text-gray-800">
                        {member.situation_matrimoniale === "célibataire"
                          ? "Célibataire"
                          : member.situation_matrimoniale === "marié"
                          ? "Marié(e)"
                          : member.situation_matrimoniale === "divorcé"
                          ? "Divorcé(e)"
                          : "Veuf/Veuve"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Membership Info */}
              <Card className="border-purple-200 shadow-md">
                <CardHeader className="bg-purple-50 border-b border-purple-200">
                  <CardTitle className="text-lg text-blue-900">Statut Adhésion</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-sm text-purple-600">Statut</p>
                    <p className={`text-lg font-bold ${member.statut === "actif" ? "text-green-600" : "text-red-600"}`}>
                      {member.statut === "actif" ? "Actif" : "Inactif"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600">Date d&#39;adhésion</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <p className="font-medium text-gray-800">
                        {member.date_adhesion ? formatDate(member.date_adhesion) : "Non renseignée"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600">Total cotisé</p>
                    <div className="flex items-center gap-2 mt-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <p className="font-bold text-green-600">{formatCurrency(total)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contributions Summary */}
            <Card className="border-purple-200 shadow-md">
              <CardHeader className="bg-purple-50 border-b border-purple-200">
                <CardTitle className="text-blue-900">Mes Cotisations</CardTitle>
                <CardDescription className="text-purple-600">
                  {cotisations.length} cotisation(s)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {cotisations.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">Aucune cotisation trouvée.</p>
                ) : (
                  <div className="space-y-3">
                    {cotisations.slice(0, 3).map((cot) => (
                      <div key={cot.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div>
                          <p className="font-medium text-gray-900">
                            {cot.mois_cotisation
                              ? formatMonth(cot.mois_cotisation)
                              : formatDate(cot.date_operation)}
                          </p>
                          <p className="text-sm text-purple-600">Payé le {formatDate(cot.date_operation)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-green-600">{formatCurrency(cot.montant)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// Helper pour formater un mois (YYYY-MM) en "mars 2026"
function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}