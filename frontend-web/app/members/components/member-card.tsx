"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ROLE_LABELS, STATUT_LABELS } from "@/lib/constants"
import type { Membre, User } from "@/lib/types"
import { formatDate } from "./utils/member"

interface MemberCardProps {
  membre: Membre
  user?: User
}

export function MemberCard({ membre, user }: MemberCardProps) {
  const initials = `${membre.prenom[0]}${membre.nom[0]}`.toUpperCase()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={membre.photo_url || ""} alt={membre.nom} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">
            {membre.prenom} {membre.nom}
          </h3>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <Badge variant={membre.statut === "actif" ? "default" : "secondary"}>{STATUT_LABELS[membre.statut]}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Téléphone</p>
            <p className="font-medium">{membre.telephone || "N/A"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Rôle</p>
            <p className="font-medium">{ROLE_LABELS[user?.role || "membre"]}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date d&#39;adhésion</p>
            <p className="font-medium">{formatDate(membre.date_adhesion)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Profession</p>
            <p className="font-medium">{membre.profession || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
