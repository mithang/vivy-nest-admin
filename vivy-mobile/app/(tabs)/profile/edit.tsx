import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState, useEffect } from 'react'
import { SafeAreaView, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native'
import { Text, View } from '../../../components/Themed'
import { defaultStyles } from '../../../constants/styles'
// import { useAuth } from '../../../context/auth.context'
import { getUserInfo, UserInfo } from '../../../services/auth.service'
import { updateProfile, UpdateProfileRequest } from '../../../services/profile.service'

const EditProfileScreen = () => {
  // const { logout } = useAuth()
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  console.log(userInfo)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState('')

  const fetchUserInfo = async () => {
    try {
      setLoading(true)
      const info = await getUserInfo()
      setUserInfo(info)
      if (info?.sysUser) {
        setName(info.sysUser.nickName || '')
        setEmail(info.sysUser.email || '')
        setPhone(info.sysUser.phonenumber || '')
        setGender(info.sysUser.sex || '')
      }
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

  const handleSave = async () => {
    try {
      setSaving(true)

      const profileData: UpdateProfileRequest = {
        nickName: name,
        email: email,
        phonenumber: phone,
        sex: gender,
      }

      const response = await updateProfile(profileData)

      if (response.code === 200) {
        Alert.alert('Success', 'Profile updated successfully', [{ text: 'OK', onPress: () => router.back() }])
      } else {
        Alert.alert('Error', response.msg || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      Alert.alert('Error', 'Failed to update profile')
    } finally {
      setSaving(false)
    }
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
          <Text style={{ fontSize: 18, fontFamily: 'bold' }}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text style={{ color: '#007AFF', fontSize: 16 }}>{saving ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ padding: 20 }}>
          {/* Profile Information Form */}
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
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                }}
              >
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Full Name</Text>
                <TextInput
                  style={{
                    fontSize: 16,
                    padding: 10,
                    backgroundColor: 'white',
                    borderRadius: 5,
                  }}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                />
              </View>
              <View
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                }}
              >
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Email</Text>
                <TextInput
                  style={{
                    fontSize: 16,
                    padding: 10,
                    backgroundColor: 'white',
                    borderRadius: 5,
                  }}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>
              <View
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#eee',
                }}
              >
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Phone</Text>
                <TextInput
                  style={{
                    fontSize: 16,
                    padding: 10,
                    backgroundColor: 'white',
                    borderRadius: 5,
                  }}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>
              <View
                style={{
                  paddingVertical: 10,
                }}
              >
                <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Gender</Text>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      padding: 15,
                      backgroundColor: gender === '0' ? '#007AFF' : 'white',
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={() => setGender('0')}
                  >
                    <Text style={{ color: gender === '0' ? 'white' : '#000' }}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      padding: 15,
                      backgroundColor: gender === '1' ? '#007AFF' : 'white',
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={() => setGender('1')}
                  >
                    <Text style={{ color: gender === '1' ? 'white' : '#000' }}>Female</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default EditProfileScreen
