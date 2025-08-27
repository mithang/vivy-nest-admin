import { Feather, Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Pressable, SafeAreaView, TouchableOpacity, Alert } from 'react-native'
import SwitchComponent from '../../components/Switch'
import SwitchComponentNoti from '../../components/SwitchNoti'
import { Text, View } from '../../components/Themed'
import { defaultStyles } from '../../constants/styles'
import { useAuth } from '../../context/auth.context'

const Page = () => {
  const { logout } = useAuth()

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

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={{ marginTop: 50, padding: 10, flex: 1 }}>
        <View
          style={{
            marginVertical: 20,
            backgroundColor: '#ddd',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 10,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <View style={{ backgroundColor: '#fff', borderRadius: 25, justifyContent: 'center', width: 45, padding: 10 }}>
            <Feather name="user" size={24} color={'#111'} />
          </View>
          <Pressable>
            <Text style={{ fontSize: 22, fontFamily: 'medium', color: '#111' }}>John Doe</Text>
            <Text style={{ fontSize: 14, fontFamily: 'regular', color: '#808080' }}>Personal Information</Text>
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ddd',
            borderBottomWidth: 0.5,
            paddingBottom: 25,
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontFamily: 'medium' }}>Notifications</Text>
            <Text style={{ color: '#808080' }}>You will see notification on new upload</Text>
          </View>
          <SwitchComponentNoti />
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ddd',
            borderBottomWidth: 0.5,
            paddingBottom: 25,
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontFamily: 'medium' }}>Dark mode</Text>
            <Text style={{ color: '#808080' }}>Enable dark mode</Text>
          </View>
          <SwitchComponent />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: '#ddd',
            borderBottomWidth: 0.5,
            paddingBottom: 25,
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontFamily: 'medium' }}>Delivery Information</Text>
            <Text style={{ color: '#808080' }}>You can change or edit your delivery information</Text>
          </View>
          <TouchableOpacity>
            <Text>
              <Ionicons name="chevron-forward" size={20} />
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: '#ddd',
            borderBottomWidth: 0.5,
            paddingBottom: 25,
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontFamily: 'medium' }}>Payment Information</Text>
            <Text style={{ color: '#808080' }}>You can change or edit your payment information</Text>
          </View>
          <TouchableOpacity>
            <Text>
              <Ionicons name="chevron-forward" size={20} />
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: '#ddd',
            borderBottomWidth: 0.5,
            paddingBottom: 25,
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, fontFamily: 'medium' }}>Logout</Text>
            <Text style={{ color: '#808080' }}>Sign out of your account</Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Text>
              <Ionicons name="log-out-outline" size={20} color="#FC6A03" />
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Page

// Remove unused styles
