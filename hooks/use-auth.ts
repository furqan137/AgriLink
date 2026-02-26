"use client"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Unauthorized")
    return r.json()
  })

export interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
  role: "farmer" | "provider" | "buyer" | "admin"
  location: string
  isVerified: boolean
  createdAt: string
}

export function useAuth() {
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR("/api/auth/profile", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  const user: AuthUser | null = data?.user || null

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    mutate(null, false)
    router.push("/login")
  }, [mutate, router])

  return {
    user,
    isLoading,
    isError: !!error,
    isAuthenticated: !!user,
    logout,
    mutate,
  }
}
