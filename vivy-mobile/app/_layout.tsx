import { Ionicons } from '@expo/vector-icons'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { TouchableOpacity, useColorScheme } from 'react-native'

import AuthorBold from '../assets/fonts/Author-Bold.ttf'
import AuthorLight from '../assets/fonts/Author-Light.ttf'
import AuthorMedium from '../assets/fonts/Author-Medium.ttf'
import AuthorRegular from '../assets/fonts/Author-Regular.ttf'
import AuthorSemibold from '../assets/fonts/Author-Semibold.ttf'
import ProtectedRoute from '../components/ProtectedRoute'
import { Text } from '../components/Themed'
import { AuthProvider } from '../context/auth.context'
import CartProvider from '../context/context'

// Import font files

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded, error] = useFonts({
    regular: AuthorRegular,
    light: AuthorLight,
    medium: AuthorMedium,
    semibold: AuthorSemibold,
    bold: AuthorBold,
  })

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return <RootLayoutNav />
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const router = useRouter()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <CartProvider>
          <ProtectedRoute>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
              <Stack.Screen name="login/index" options={{ headerShown: false }} />
              <Stack.Screen name="signup/index" options={{ headerShown: false }} />
              <Stack.Screen name="listing/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="products/[id]" />
              <Stack.Screen
                name="(modals)/cart"
                options={{
                  presentation: 'fullScreenModal',
                  title: 'MY CART',
                  headerTitleStyle: {
                    fontFamily: 'medium',
                  },
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                      <Text>
                        <Ionicons name="close-outline" size={28} />
                      </Text>
                    </TouchableOpacity>
                  ),
                }}
              />
            </Stack>
          </ProtectedRoute>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
