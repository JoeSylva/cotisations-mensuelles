"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, DollarSign, BarChart3, Settings, LogOut, Menu, X, AlertCircle, ChevronDown, Calendar } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

const allNavItems = [
  { href: "/members", label: "Membres", icon: Users, permission: "canManageMembers" },
  { href: "/operations", label: "Opérations", icon: DollarSign, permission: "canManageOperations" },
  { href: "/type-operations", label: "Types d'opérations", icon: AlertCircle, permission: "canManageTypeOperations" },
  { href: "/cotisations", label: "Cotisations", icon: Calendar, permission: "canViewCotisations" },
  { href: "/reports", label: "Rapports", icon: BarChart3, permission: "canViewReports" },
  { href: "/settings", label: "Paramètres", icon: Settings, permission: "canAccessSettings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [dashboardOpen, setDashboardOpen] = useState(true)
  const { logout, permissions, user } = useAuth()

  const navItems = allNavItems.filter((item) => {
    const permission = item.permission as keyof typeof permissions
    return permissions?.[permission] || false
  })

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const isDashboardActive = pathname.startsWith("/dashboard")

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 lg:hidden bg-primary text-primary-foreground p-2 rounded-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-purple-600 text-white border-r border-purple-700 transition-transform duration-300 z-30 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-purple-700">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                <Image
                  src="/rakotomalala_logo.png"
                  alt="Logo Rakotomalala"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="font-bold text-lg text-white">GestTresoRT</span>
            </div>
          </Link>
          {user && (
            <p className="text-xs text-white/60 mt-2">
              {user.prenom} {user.nom} • {user.role}
            </p>
          )}
        </div>

        <nav className="p-4 space-y-2">
          {/* Dashboard avec sous-menu */}
          <div>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-white hover:bg-white/10 hover:text-white ${
                isDashboardActive
                  ? "bg-white/20 text-white"
                  : ""
              }`}
              onClick={() => setDashboardOpen(!dashboardOpen)}
            >
              <LayoutDashboard className="w-4 h-4 text-white" />
              <span className="flex-1 text-left text-white">Tableau de bord</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dashboardOpen ? 'rotate-180' : ''}`} />
            </Button>
            {dashboardOpen && (
              <div className="ml-6 mt-1 space-y-1">
                <Link href="/dashboard/admin" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm text-white hover:bg-white/10 ${
                      pathname === "/dashboard/admin" ? "bg-white/20 text-white" : ""
                    }`}
                  >
                    Vue Admin
                  </Button>
                </Link>
                <Link href="/dashboard/tresorier" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm text-white hover:bg-white/10 ${
                      pathname === "/dashboard/tresorier" ? "bg-white/20 text-white" : ""
                    }`}
                  >
                    Vue Trésorier
                  </Button>
                </Link>
                <Link href="/dashboard/member" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start text-sm text-white hover:bg-white/10 ${
                      pathname === "/dashboard/member" ? "bg-white/20 text-white" : ""
                    }`}
                  >
                    Vue Membre
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Autres éléments de navigation */}
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 text-white hover:bg-white/10 ${
                    isActive ? "bg-white/20 text-white" : ""
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-red-200 hover:bg-red-500/20 hover:text-red-100"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Overlay on mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}