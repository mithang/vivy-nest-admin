import { useRouter, useSegments } from 'expo-router'
import React, { useEffect } from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { useAuth } from '../context/auth.context'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    // Check if we're not already navigating to login or onboarding
    const inAuthGroup = segments[0] === '(tabs)'
    const inLogin = segments[segments.length - 1] === 'login'
    const inOnboarding = segments[segments.length - 1] === 'onboarding'

    if (!isLoading) {
      if (!isAuthenticated && inAuthGroup && !inLogin && !inOnboarding) {
        // Redirect to login if not authenticated and trying to access protected routes
        router.replace('/login/')
      } else if (isAuthenticated && (inLogin || inOnboarding)) {
        // Redirect to home if authenticated and trying to access login/onboarding
        router.replace('/(tabs)/')
      }
    }
  }, [isAuthenticated, isLoading, segments, router])

  // Show loading indicator while checking auth status
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FC6A03" />
      </View>
    )
  }

  // Render children if authenticated or accessing public routes
  return <>{children}</>
}

export default ProtectedRoute
