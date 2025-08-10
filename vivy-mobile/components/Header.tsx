import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { defaultStyles } from '../constants/styles'
import { Text, View } from './Themed'

interface Props {
  title: string
  headerText: string
  desc: string
  actionText: string
}

// Move styles to top
const styles = StyleSheet.create({
  btnOutline: {
    borderWidth: 1,
    height: 50,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: '#ffff',
    fontSize: 14,
  },
  speratorView: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 30,
  },
  separator: {
    fontFamily: 'bold',
  },
})

const Header = ({ title, headerText, desc, actionText }: Props) => {
  const router = useRouter()

  return (
    <View style={{ paddingHorizontal: 26 }}>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={34} color={'#111'} />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 60 }}>
        <Text style={defaultStyles.headerText}>{headerText}</Text>
        <Text style={[defaultStyles.ptag, { color: '#808080' }]}>{desc}</Text>

        <View style={{ gap: 16, marginTop: 32 }}>
          <TouchableOpacity style={[styles.btnOutline, { backgroundColor: '#111' }]}>
            <Ionicons name="md-logo-apple" size={24} color={'#fff'} style={defaultStyles.btnIcon} />
            <Text style={[styles.btnOutlineText, { color: '#FFF' }]}>{actionText} with Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnOutline, { backgroundColor: '#fff' }]}>
            <Ionicons name="md-logo-google" size={24} style={defaultStyles.btnIcon} />
            <Text style={[styles.btnOutlineText, { color: '#111' }]}>{actionText} with Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.speratorView}>
          <View
            style={{
              flex: 1,
              borderBottomColor: '#808080',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <Text style={styles.separator}>Or type your own</Text>
          <View
            style={{
              flex: 1,
              borderBottomColor: '#808080',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>
      </View>
    </View>
  )
}

export default Header
