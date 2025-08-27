import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { SafeAreaView, TouchableOpacity, Alert, Image } from 'react-native'
import { Text, View } from '../../../components/Themed'
import { defaultStyles } from '../../../constants/styles'
import { useAuth } from '../../../context/auth.context'
import { getUserInfo, UserInfo } from '../../../services/auth.service'

const ProfileScreen = () => {
  const { logout } = useAuth()
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserInfo = async () => {
    try {
      setLoading(true)
      const info = await getUserInfo()
      setUserInfo(info)
    } catch (error) {
      console.error('Error fetching user info:', error)
      Alert.alert('Error', 'Failed to fetch user information')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout()
          },
        },
      ],
      { cancelable: true }
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={defaultStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={{ marginTop: 50, padding: 20, flex: 1 }}>
        {/* Profile Header */}
        <View
          style={{
            alignItems: 'center',
            marginBottom: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/profile/avatar')}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#ddd',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15,
            }}
          >
            {userInfo?.sysUser?.avatar ? (
              <Image source={{ uri: userInfo.sysUser.avatar }} style={{ width: 100, height: 100, borderRadius: 50 }} />
            ) : (
              <Ionicons name="person-circle-outline" size={100} color="#888" />
            )}
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#007AFF',
                width: 30,
                height: 30,
                borderRadius: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontFamily: 'bold' }}>
            {userInfo?.sysUser?.nickName || userInfo?.sysUser?.userName || 'User'}
          </Text>
          <Text style={{ fontSize: 16, color: '#666', marginTop: 5 }}>
            {userInfo?.sysUser?.email || 'No email provided'}
          </Text>
        </View>

        {/* Profile Information */}
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 20, fontFamily: 'bold', marginBottom: 15 }}>Personal Information</Text>
          <View
            style={{
              backgroundColor: '#f5f5f5',
              borderRadius: 10,
              padding: 15,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
            >
              <Text style={{ fontSize: 16, color: '#666' }}>Username</Text>
              <Text style={{ fontSize: 16 }}>{userInfo?.sysUser?.userName || 'N/A'}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
            >
              <Text style={{ fontSize: 16, color: '#666' }}>Full Name</Text>
              <Text style={{ fontSize: 16 }}>{userInfo?.sysUser?.nickName || 'N/A'}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
            >
              <Text style={{ fontSize: 16, color: '#666' }}>Email</Text>
              <Text style={{ fontSize: 16 }}>{userInfo?.sysUser?.email || 'N/A'}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
            >
              <Text style={{ fontSize: 16, color: '#666' }}>Phone</Text>
              <Text style={{ fontSize: 16 }}>{userInfo?.sysUser?.phonenumber || 'N/A'}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
              }}
            >
              <Text style={{ fontSize: 16, color: '#666' }}>Gender</Text>
              <Text style={{ fontSize: 16 }}>
                {userInfo?.sysUser?.sex === '0' ? 'Male' : userInfo?.sysUser?.sex === '1' ? 'Female' : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={{ gap: 15 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#007AFF',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
            }}
            onPress={() => router.push('/(tabs)/profile/edit')}
          >
            <Text style={{ color: 'white', fontSize: 16, fontFamily: 'bold' }}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#007AFF',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
            }}
            onPress={() => router.push('/(tabs)/profile/change-password')}
          >
            <Text style={{ color: 'white', fontSize: 16, fontFamily: 'bold' }}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#FF3B30',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
            }}
            onPress={handleLogout}
          >
            <Text style={{ color: 'white', fontSize: 16, fontFamily: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default ProfileScreen
