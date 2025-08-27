import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_BASE_URL, API_ENDPOINTS, HEADERS, STORAGE_KEYS } from '../constants/api'

/**
 * Authentication Service
 * Handles user authentication and token management
 */

// Login request data structure
export interface LoginRequest {
  username: string
  password: string
  code?: string // Make captcha code optional
  uuid?: string // Make captcha uuid optional
}

// Login response data structure
export interface LoginResponse {
  code: number
  msg: string
  data: {
    access_token: string
    expires_in: number
  }
}

// User info response structure
export interface UserInfo {
  sysUser: {
    userId: number
    userName: string
    nickName: string
    email: string
    phonenumber: string
    sex: string
    avatar: string
  }
  roles: string[]
  permissions: string[]
}

/**
 * Login user
 * @param credentials Login credentials
 * @returns Login response with token
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  try {
    // Remove captcha fields if they are not provided
    const loginData = { ...credentials }
    if (!loginData.code || !loginData.uuid) {
      delete loginData.code
      delete loginData.uuid
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': HEADERS.CONTENT_TYPE,
        Accept: HEADERS.ACCEPT,
      },
      body: JSON.stringify(loginData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: LoginResponse = await response.json()

    // Store token if login successful
    if (data.code === 200) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.data.access_token)
    }

    return data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Logout user
 * @returns Logout response
 */
export const logout = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    if (token) {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
        method: 'POST',
        headers: {
          'Content-Type': HEADERS.CONTENT_TYPE,
          Accept: HEADERS.ACCEPT,
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        console.warn(`Logout HTTP error! status: ${response.status}`)
      }
    }

    // Clear stored token and user info
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_INFO)

    return true
  } catch (error) {
    console.error('Logout error:', error)
    return false
  }
}

/**
 * Get stored access token
 * @returns Access token or null
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  } catch (error) {
    console.error('Error getting access token:', error)
    return null
  }
}

/**
 * Get user info
 * @returns User info or null
 */
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const token = await getAccessToken()

    if (!token) {
      return null
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.USER_INFO}`, {
      method: 'GET',
      headers: {
        'Content-Type': HEADERS.CONTENT_TYPE,
        Accept: HEADERS.ACCEPT,
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.code === 200) {
      // Store user info
      await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(data.data))
      return data.data
    }

    return null
  } catch (error) {
    console.error('Get user info error:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 * @returns True if user is authenticated, false otherwise
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getAccessToken()
    return !!token
  } catch (error) {
    console.error('Error checking authentication status:', error)
    return false
  }
}
