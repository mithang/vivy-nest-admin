import React, { useState, useEffect } from 'react'
import { Text, View, StyleSheet, ScrollView } from 'react-native'
import { login } from '../services/auth.service'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  loading: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: '#FC6A03',
  },
  resultsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultItem: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  note: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
})

const TestAPIPage = () => {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const testLoginAPI = async () => {
    setIsLoading(true)
    setTestResults((prev) => [...prev, 'Testing login API...'])

    try {
      // Test with invalid credentials to see if we get a response
      const response = await login({
        username: 'admin',
        password: 'invalid-password',
      })

      setTestResults((prev) => [...prev, `Login API Response: ${JSON.stringify(response)}`])

      if (response.code === 400) {
        setTestResults((prev) => [...prev, '✓ API connection successful - received expected error response'])
      } else {
        setTestResults((prev) => [...prev, '⚠ Unexpected response from API'])
      }
    } catch (error: any) {
      setTestResults((prev) => [...prev, `✗ API connection failed: ${error.message}`])
      console.error('API test error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testLoginAPI()
  }, [])

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>API Connection Test</Text>
      <Text style={styles.description}>This page tests the connection between the mobile app and the backend API.</Text>

      {isLoading && <Text style={styles.loading}>Testing API connection...</Text>}

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultItem}>
            {result}
          </Text>
        ))}
      </View>

      <Text style={styles.note}>
        Note: The test uses invalid credentials to verify API connectivity. A "Captcha has expired" error indicates
        successful connection to the backend.
      </Text>
    </ScrollView>
  )
}

export default TestAPIPage
