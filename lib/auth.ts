import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { connectDB } from "./mongodb"
import User from "./models/User"

const JWT_SECRET = process.env.JWT_SECRET || "agrilink-secret-key-2024"

export interface TokenPayload {
  userId: string
  role: string
  email: string
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

export async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("agrilink-token")?.value

  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  await connectDB()
  const user = await User.findById(payload.userId).select("-password")
  if (!user) return null

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    location: user.location,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  }
}

export function requireRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole)
}
