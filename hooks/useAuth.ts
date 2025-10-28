import { create } from "zustand"
import type { User } from "@/types"
import { authStorage } from "@/services/auth"
import { api } from "@/services/api"

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  initialize: () => Promise<void>
  updateUser: (user: User) => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    try {
      const token = await authStorage.getToken()
      if (token) {
        const user = await api.getCurrentUser(token)
        set({ user, token, isAuthenticated: true, isLoading: false })
      } else {
        set({ isLoading: false })
      }
    } catch (error) {
      console.error("Initialize error:", error)
      await authStorage.removeToken()
      set({ isLoading: false })
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { user, token } = await api.login({ email, password })
      await authStorage.setToken(token)
      set({ user, token, isAuthenticated: true })
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const { user, token } = await api.register({ name, email, password })
      await authStorage.setToken(token)
      set({ user, token, isAuthenticated: true })
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  },

  logout: async () => {
    await authStorage.removeToken()
    set({ user: null, token: null, isAuthenticated: false })
  },

  updateUser: (user: User) => {
    set({ user })
  },
}))
