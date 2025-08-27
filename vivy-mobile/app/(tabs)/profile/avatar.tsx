import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { SafeAreaView, TouchableOpacity, Alert, Image } from 'react-native'
import { Text, View } from '../../../components/Themed'
import { defaultStyles } from '../../../constants/styles'
// import { useAuth } from '../../../context/auth.context'
import { uploadAvatar } from '../../../services/profile.service'

const AvatarUploadScreen = () => {
  // const { logout } = useAuth()
  const router = useRouter()
  const [avatar, setAvatar] = useState<string | null>(null)
  const [avatarData, setAvatarData] = useState<ImagePicker.ImagePickerAsset | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleSelectImage = async () => {
    try {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'Permission to access camera roll is required!')
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0]
        setAvatar(selectedImage.uri)
        setAvatarData(selectedImage)
      }
    } catch (error) {
      console.error('Error selecting image:', error)
      Alert.alert('Error', 'Failed to select image')
    }
  }

  const handleUploadAvatar = async () => {
    try {
      if (!avatar || !avatarData) {
        Alert.alert('Error', 'Please select an image first')
        return
      }

      setUploading(true)

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('avatar', {
        uri: avatarData.uri,
        type: avatarData.mimeType || 'image/jpeg',
        name: avatarData.fileName || 'avatar.jpg',
      } as any)

      const response = await uploadAvatar(formData)

      if (response.code === 200) {
        Alert.alert('Success', 'Avatar updated successfully', [{ text: 'OK', onPress: () => router.back() }])
      } else {
        Alert.alert('Error', response.msg || 'Failed to upload avatar')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      Alert.alert('Error', 'Failed to upload avatar')
    } finally {
      setUploading(false)
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
          <Text style={{ fontSize: 18, fontFamily: 'bold' }}>Change Avatar</Text>
          <TouchableOpacity onPress={handleUploadAvatar} disabled={uploading || !avatar}>
            <Text style={{ color: uploading ? '#888' : '#007AFF', fontSize: 16 }}>
              {uploading ? 'Uploading...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, padding: 20, alignItems: 'center' }}>
          {/* Avatar Preview */}
          <View
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              backgroundColor: '#f5f5f5',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 30,
              borderWidth: 2,
              borderColor: '#ddd',
            }}
          >
            {avatar ? (
              <Image source={{ uri: avatar }} style={{ width: 200, height: 200, borderRadius: 100 }} />
            ) : (
              <Ionicons name="person-circle-outline" size={150} color="#888" />
            )}
          </View>

          {/* Select Image Button */}
          <TouchableOpacity
            style={{
              backgroundColor: '#007AFF',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              width: '80%',
            }}
            onPress={handleSelectImage}
          >
            <Text style={{ color: 'white', fontSize: 16, fontFamily: 'bold' }}>Select Image</Text>
          </TouchableOpacity>

          {/* Instructions */}
          <View
            style={{
              backgroundColor: '#f5f5f5',
              borderRadius: 10,
              padding: 15,
              marginTop: 30,
              width: '100%',
            }}
          >
            <Text style={{ fontSize: 16, fontFamily: 'bold', marginBottom: 10 }}>Avatar Requirements</Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>• JPG, PNG, or GIF format</Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>• Maximum file size: 5MB</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>• Recommended dimensions: 400x400 pixels</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AvatarUploadScreen
