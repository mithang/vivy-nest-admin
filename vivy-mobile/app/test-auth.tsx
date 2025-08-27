import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useAuth } from '../context/auth.context'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 16,
    color: '#333',
  },
  userInfoContainer: {
    backgroundColor: '#e8f4f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  userInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#FC6A03',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
})

const TestAuthPage = () => {
  const { login, logout, isAuthenticated, user } = useAuth()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')

  const handleLogin = async () => {
    try {
      const success = await login(username, password)
      if (success) {
        Alert.alert('Success', 'Login successful!')
      } else {
        Alert.alert('Error', 'Login failed. Please check your credentials.')
      }
    } catch (error: any) {
      Alert.alert('Error', 'An error occurred during login.')
      console.error('Login error:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      Alert.alert('Success', 'Logout successful!')
    } catch (error: any) {
      Alert.alert('Error', 'An error occurred during logout.')
      console.error('Logout error:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication Test</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Authentication Status:</Text>
        <Text style={styles.statusValue}>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</Text>
      </View>

      {user && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoLabel}>User Info:</Text>
          <Text>Name: {user.sysUser.userName}</Text>
          <Text>Email: {user.sysUser.email}</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Test Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Test Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default TestAuthPage
