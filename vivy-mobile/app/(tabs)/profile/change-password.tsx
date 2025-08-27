import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { SafeAreaView, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native'
import { Text, View } from '../../../components/Themed'
import { defaultStyles } from '../../../constants/styles'
// import { useAuth } from '../../../context/auth.context'
import { changePassword, ChangePasswordRequest } from '../../../services/profile.service'

const ChangePasswordScreen = () => {
  // const { logout } = useAuth()
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    try {
      if (!currentPassword || !newPassword || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all fields')
        return
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'New password and confirm password do not match')
        return
      }

      if (newPassword.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long')
        return
      }

      setLoading(true)

      const passwordData: ChangePasswordRequest = {
        oldPassword: currentPassword,
        newPassword: newPassword,
      }

      const response = await changePassword(passwordData)

      if (response.code === 200) {
        Alert.alert('Success', 'Password changed successfully', [{ text: 'OK', onPress: () => router.back() }])
      } else {
        Alert.alert('Error', response.msg || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      Alert.alert('Error', 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontFamily: 'bold' }}>Change Password</Text>
          <TouchableOpacity onPress={handleChangePassword} disabled={loading}>
            <Text style={{ color: '#007AFF', fontSize: 16 }}>{loading ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ padding: 20 }}>
          {/* Password Change Form */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: 20, fontFamily: 'bold', marginBottom: 15 }}>Change Password</Text>
            <View
              style={{
                backgroundColor: '#f5f5f5',
                borderRadius: 10,
                padding: 15,
              }}
            >
              <View
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                }}
              >
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Current Password</Text>
                <TextInput
                  style={{
                    fontSize: 16,
                    padding: 10,
                    backgroundColor: 'white',
                    borderRadius: 5,
                  }}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  secureTextEntry
                />
              </View>
              <View
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                }}
              >
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>New Password</Text>
                <TextInput
                  style={{
                    fontSize: 16,
                    padding: 10,
                    backgroundColor: 'white',
                    borderRadius: 5,
                  }}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry
                />
              </View>
              <View
                style={{
                  paddingVertical: 10,
                }}
              >
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Confirm New Password</Text>
                <TextInput
                  style={{
                    fontSize: 16,
                    padding: 10,
                    backgroundColor: 'white',
                    borderRadius: 5,
                  }}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          {/* Password Requirements */}
          <View
            style={{
              backgroundColor: '#f5f5f5',
              borderRadius: 10,
              padding: 15,
            }}
          >
            <Text style={{ fontSize: 16, fontFamily: 'bold', marginBottom: 10 }}>Password Requirements</Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>• At least 6 characters long</Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>• Contains both letters and numbers</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>• Not commonly used</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default ChangePasswordScreen
