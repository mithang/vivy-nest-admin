import AsyncStorage from '@react-native-async-storage/async-storage'
import { API_BASE_URL, HEADERS, STORAGE_KEYS } from '../constants/api'

/**
 * Profile Service
 * Handles user profile management operations
 */

// Profile update request data structure
export interface UpdateProfileRequest {
  nickName?: string
  email?: string
  phonenumber?: string
  sex?: string
}

// Change password request data structure
export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

// Update profile response structure
export interface UpdateProfileResponse {
  code: number
  msg: string
  data: any
}

// Change password response structure
export interface ChangePasswordResponse {
  code: number
  msg: string
  data: any
}

/**
 * Get authentication token
 * @returns Access token or null
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  } catch (error) {
    console.error('Error getting auth token:', error)
    return null
  }
}

/**
 * Update user profile
 * @param profileData Profile data to update
 * @returns Update response
 */
export const updateProfile = async (profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': HEADERS.CONTENT_TYPE,
        Accept: HEADERS.ACCEPT,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: UpdateProfileResponse = await response.json()
    return data
  } catch (error) {
    console.error('Update profile error:', error)
    throw error
  }
}

/**
 * Change user password
 * @param passwordData Password change data
 * @returns Change password response
 */
export const changePassword = async (passwordData: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/profile/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': HEADERS.CONTENT_TYPE,
        Accept: HEADERS.ACCEPT,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ChangePasswordResponse = await response.json()
    return data
  } catch (error) {
    console.error('Change password error:', error)
    throw error
  }
}

/**
 * Upload user avatar
 * @param avatarData Avatar image data
 * @returns Upload response
 */
export const uploadAvatar = async (avatarData: FormData): Promise<UpdateProfileResponse> => {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/profile/avatar`, {
      method: 'POST',
      headers: {
        Accept: HEADERS.ACCEPT,
        Authorization: `Bearer ${token}`,
      },
      body: avatarData,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: UpdateProfileResponse = await response.json()
    return data
  } catch (error) {
    console.error('Upload avatar error:', error)
    throw error
  }
}
