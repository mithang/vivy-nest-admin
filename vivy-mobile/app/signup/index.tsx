import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native'
import Header from '../../components/Header'
import { Text, View } from '../../components/Themed'

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
  loginContainer: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  loginText: {
    textAlign: 'center',
    fontFamily: 'bold',
    fontSize: 16,
    color: '#FC6A03',
  },
})

const Page = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async () => {
    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    if (!password.trim()) {
      setError('Please enter your password')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      // In a real app, you would call an API to create the account
      // For now, we'll just simulate a successful signup
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to login screen after successful signup
      router.push('/login/')
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'An error occurred during signup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    router.push('/login/')
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <Header title="Create Account" headerText="Create Account" desc="Sign up to get started" actionText="Sign up" />

        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
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
              returnKeyType="next"
              editable={!loading}
            />
            <TextInput
              placeholder="Confirm Password"
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
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
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Sign up</Text>}
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginText}>Have An Account?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Page
