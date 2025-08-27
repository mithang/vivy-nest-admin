import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Header from '../../components/Header'
import { Text, View } from '../../components/Themed'
import { useAuth } from '../../context/auth.context'

// Move styles to top
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 20,
  },
  inputContainer: {
    marginTop: 30,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#ABABAB',
    borderRadius: 8,
    padding: 10,
    color: '#000',
    fontSize: 16,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 50,
  },
  button: {
    backgroundColor: '#FC6A03',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'bold',
  },
  signupContainer: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  signupText: {
    textAlign: 'center',
    fontFamily: 'bold',
    fontSize: 16,
    color: '#FC6A03',
  },
})

const Page = () => {
  const router = useRouter()
  const { login: authLogin } = useAuth()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    // Basic validation
    if (!username.trim()) {
      setError('Please enter your username')
      return
    }

    if (!password.trim()) {
      setError('Please enter your password')
      return
    }

    setLoading(true)
    setError('')

    try {
      const success = await authLogin(username, password)

      if (success) {
        // Login successful, navigate to main app
        router.push('/(tabs)/')
      } else {
        // Login failed
        setError('Invalid username or password. Please try again.')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      // Check if it's a captcha-related error
      if (err.message && err.message.includes('Captcha')) {
        setError('Captcha is required. Please contact admin to disable captcha.')
      } else {
        setError(err.message || 'An error occurred during login. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = () => {
    router.push('/signup/')
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <Header title="Welcome Back" headerText="Welcome Back" desc="Sign in to your account" actionText="Sign in" />

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Username"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              returnKeyType="next"
              editable={!loading}
            />
            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              editable={!loading}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Log in</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signupText}>Create Account?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Page
