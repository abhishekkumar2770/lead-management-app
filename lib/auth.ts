// Simple authentication system for demo purposes
// In a real app, this would integrate with a proper auth provider

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "agent"
}

// Mock user data
const users: User[] = [
  {
    id: "user1",
    email: "admin@company.com",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "user2",
    email: "agent@company.com",
    name: "Sales Agent",
    role: "agent",
  },
]

// Simple session management
let currentUser: User | null = null

export function getCurrentUser(): User | null {
  return currentUser
}

export function signIn(email: string, password: string): User | null {
  // Simple demo authentication - in real app, verify password hash
  const user = users.find((u) => u.email === email)
  if (user && password === "demo123") {
    currentUser = user
    return user
  }
  return null
}

export function signOut(): void {
  currentUser = null
}

export function isAuthenticated(): boolean {
  return currentUser !== null
}

export function requireAuth(): User {
  if (!currentUser) {
    throw new Error("Authentication required")
  }
  return currentUser
}
