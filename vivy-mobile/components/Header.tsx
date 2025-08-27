import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text, View } from '../components/Themed'
import { defaultStyles } from '../constants/styles'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  btn: {
    backgroundColor: '#111',
    padding: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  btnIcon: {
    color: '#fff',
  },
  btnText: {
    color: '#fff',
    fontFamily: 'medium',
  },
})

interface HeaderProps {
  title: string
  headerText: string
  desc: string
  actionText: string
}

const Header: React.FC<HeaderProps> = ({ title, headerText, desc, actionText }) => {
  const router = useRouter()

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={34} color={'#111'} />
      </TouchableOpacity>

      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 16, fontFamily: 'regular', color: '#808080' }}>{headerText}</Text>
        <Text style={{ fontSize: 24, fontFamily: 'bold' }}>{title}</Text>
        <Text style={{ fontSize: 14, fontFamily: 'regular', color: '#808080' }}>{desc}</Text>
      </View>

      <View style={{ width: 30 }}>
        <TouchableOpacity style={styles.btn}>
          <Ionicons name="logo-apple" size={24} color={'#fff'} style={defaultStyles.btnIcon} />
          <Text style={styles.btnText}>{actionText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Header
