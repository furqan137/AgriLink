"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Loader2, Search, CheckCircle2, Trash2, Shield, Users,
  UserCheck, AlertTriangle
} from "lucide-react"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface UserItem {
  _id: string
  name: string
  email: string
  phone: string
  role: string
  location: string
  isVerified: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const { data, isLoading, mutate } = useSWR("/api/admin?resource=users", fetcher)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [acting, setActing] = useState<string | null>(null)

  const allUsers: UserItem[] = data?.users || []
  const users = allUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.location.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "all" || u.role === roleFilter
    return matchSearch && matchRole
  })

  async function handleAction(action: "verify" | "delete", userId: string) {
    const confirmMsg = action === "delete"
      ? "Are you sure you want to delete this user? This cannot be undone."
      : "Verify this user?"
    if (!confirm(confirmMsg)) return

    setActing(userId)
    try {
      const res = await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userId }),
      })
      if (res.ok) {
        toast.success(action === "verify" ? "User verified!" : "User deleted!")
        mutate()
      } else {
        toast.error("Action failed")
      }
    } catch {
      toast.error("Network error")
    }
    setActing(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#16a34a]" />
      </div>
    )
  }

  const roles = ["all", "farmer", "provider", "buyer", "admin"]

  const roleBadgeColor: Record<string, string> = {
    farmer: "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20",
    provider: "bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/20",
    buyer: "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20",
    admin: "bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <p className="text-muted-foreground">Verify, manage, and monitor all platform users.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {roles.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={roleFilter === r ? "default" : "outline"}
              className={roleFilter === r ? "bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff]" : ""}
              onClick={() => setRoleFilter(r)}
            >
              {r === "all" ? "All" : r.charAt(0).toUpperCase() + r.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="w-4 h-4" />
        Showing {users.length} of {allUsers.length} users
      </div>

      {users.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No users found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filter.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {users.map((u) => (
            <Card key={u._id} className="card-hover border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#16a34a] to-[#0ea5e9] flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-[#ffffff]">{u.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{u.name}</p>
                        <Badge className={roleBadgeColor[u.role] || "bg-muted"}>
                          <span className="capitalize">{u.role}</span>
                        </Badge>
                        {u.isVerified ? (
                          <Badge className="bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20 text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Unverified
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                        <span>{u.email}</span>
                        <span>{u.phone}</span>
                        <span>{u.location}</span>
                        <span>Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-13 sm:ml-0">
                    {!u.isVerified && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#16a34a] border-[#16a34a]/30 hover:bg-[#16a34a]/10"
                        disabled={acting === u._id}
                        onClick={() => handleAction("verify", u._id)}
                      >
                        {acting === u._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Shield className="w-3.5 h-3.5 mr-1" /> Verify</>}
                      </Button>
                    )}
                    {u.role !== "admin" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-[#dc2626] border-[#dc2626]/30 hover:bg-[#dc2626]/10"
                        disabled={acting === u._id}
                        onClick={() => handleAction("delete", u._id)}
                      >
                        {acting === u._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Trash2 className="w-3.5 h-3.5 mr-1" /> Delete</>}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
