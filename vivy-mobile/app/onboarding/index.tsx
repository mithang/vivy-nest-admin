import { useRouter } from 'expo-router'
import React from 'react'
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// Move styles to top
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  logo: {
    color: 'white',
    fontSize: 30,
    textTransform: 'uppercase',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    lineHeight: 84,
    fontWeight: 'bold',
    fontFamily: 'bold',
    textAlign: 'center',
  },
  ptag: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'medium',
  },
  hero: {
    fontFamily: 'bold',
    fontSize: 44,
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  btn: {
    backgroundColor: '#FC6A03',
    flex: 1,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

const Page = () => {
  const router = useRouter()
  const image = { uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8' }

  const onRoute = () => {
    router.push('/(tabs)/')
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={{ position: 'absolute', top: 50 }}>
          <Text style={styles.logo}>Brandx</Text>
        </View>
        <View style={{ position: 'absolute', bottom: 200 }}>
          <Text style={styles.hero}>Fashion</Text>
          <Text style={styles.hero}>Inspired</Text>
          <Text style={styles.ptag}>Discover the best product for fashion</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={onRoute}>
          <Text style={styles.text}>Get Started</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
}

export default Page
