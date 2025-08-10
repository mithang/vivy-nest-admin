import { useRouter } from 'expo-router'
import React from 'react'
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import Header from '../../components/Header'
import { Text, View } from '../../components/Themed'
import { defaultStyles } from '../../constants/styles'

// Move styles to top
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FC6A03',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 100,
  },
  ptag: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'bold',
  },
})

const Page = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={defaultStyles.container}>
      <Header title="Create Account" headerText="Create Account" desc="Sign up to get started" actionText="Sign up" />
      <View style={[defaultStyles.container, { paddingHorizontal: 26 }]}>
        <TextInput placeholder="Email" style={[defaultStyles.inputField, { marginBottom: 30 }]} />
        <TextInput placeholder="Password" style={defaultStyles.inputField} secureTextEntry />
        <View style={{ alignItems: 'flex-end', marginTop: 30 }}>
          <TouchableOpacity onPress={() => router.push('/login/')}>
            <Text style={{ textAlign: 'center', fontFamily: 'bold', fontSize: 16 }}>Have An Account?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.ptag}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default Page
