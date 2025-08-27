import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useAuth } from '../context/auth.context'

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    color: '#333',
  },
})

const AuthStatus: React.FC = () => {
  const { isAuthenticated, user, token } = useAuth()

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Authentication Status:</Text>
      <Text style={styles.value}>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
      {user && (
        <>
          <Text style={styles.label}>User Info:</Text>
          <Text style={styles.value}>Username: {user.user_name}</Text>
          <Text style={styles.value}>Email: {user.email}</Text>
        </>
      )}
      {token && (
        <>
          <Text style={styles.label}>Token:</Text>
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="middle">
            {token.substring(0, 10)}...{token.substring(token.length - 10)}
          </Text>
        </>
      )}
    </View>
  )
}

export default AuthStatus
