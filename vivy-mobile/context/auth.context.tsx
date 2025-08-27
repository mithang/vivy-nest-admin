import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  login as apiLogin,
  logout as apiLogout,
  getUserInfo,
  getAccessToken,
  UserInfo,
  LoginRequest,
} from '../services/auth.service'

// Define the shape of our authentication context
interface AuthContextType {
  user: UserInfo | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
  refreshUser: async () => {},
})

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// AuthProvider component props
interface AuthProviderProps {
  children: ReactNode
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      const accessToken = await getAccessToken()

      if (accessToken) {
        setToken(accessToken)
        setIsAuthenticated(true)

        // Fetch user info
        const userInfo = await getUserInfo()
        if (userInfo) {
          setUser(userInfo)
        }
      } else {
        setUser(null)
        setToken(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setUser(null)
      setToken(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const credentials: LoginRequest = {
        username,
        password,
      }

      const response = await apiLogin(credentials)

      if (response.code === 200) {
        // Login successful
        const accessToken = response.data.access_token
        setToken(accessToken)
        setIsAuthenticated(true)

        // Fetch user info
        const userInfo = await getUserInfo()
        if (userInfo) {
          setUser(userInfo)
        }

        return true
      } else {
        // Login failed
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await apiLogout()

      // Clear state
      setUser(null)
      setToken(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout error:', error)

      // Even if API call fails, clear local state
      setUser(null)
      setToken(null)
      setIsAuthenticated(false)
    }
  }

  const refreshUser = async () => {
    try {
      if (isAuthenticated) {
        const userInfo = await getUserInfo()
        if (userInfo) {
          setUser(userInfo)
        }
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
