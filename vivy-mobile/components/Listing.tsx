import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native'

import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import SwiperFlatList from 'react-native-swiper-flatlist'

import Colors from '../constants/Colors'
import { Text } from './Themed'

const { height } = Dimensions.get('window') // Remove unused width

// Move styles to top
const styles = StyleSheet.create({
  image: {
    height: height * 0.25,
    width: '100%',
    borderRadius: 5,
  },
  text: {
    fontFamily: 'bold',
    fontSize: 24,
  },
})

const Listing = ({ data }: any) => {
  // Remove unused router

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={{ height: 300, marginTop: 20 }}>
      <Text style={styles.text}>Trending Now</Text>
      <SwiperFlatList
        autoplayLoopKeepAnimation
        autoplay
        autoplayDelay={2}
        index={3}
        style={{ marginTop: 10 }}
        autoplayLoop
        data={data}
        renderItem={({ item }) => (
          <View style={{ width: 250, marginRight: 30 }}>
            <View style={{ flexDirection: 'column', width: '100%' }}>
              <Image style={styles.image} source={{ uri: item.image }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 }}>
                <Text style={{ color: Colors.orange, fontFamily: 'bold', fontSize: 26 }}>${item.price}</Text>
                <TouchableOpacity>
                  <Ionicons name="bookmark-outline" size={20} />
                </TouchableOpacity>
              </View>
              <Text style={{ fontFamily: 'medium', fontSize: 16 }}>{item.name}</Text>
            </View>
          </View>
        )}
      />
    </Animated.View>
  )
}

export default Listing
