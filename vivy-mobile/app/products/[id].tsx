// This is the product details page
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'

import Animated, { FadeInDown } from 'react-native-reanimated'
import SwiperFlatList from 'react-native-swiper-flatlist'
import { Text, View } from '../../components/Themed'
import Colors from '../../constants/Colors'
import { defaultStyles } from '../../constants/styles'
import { useCartStore } from '../../context/context'

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  slide: {
    height: 300,
    width: '100%',
  },
  dots: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  activeDot: {
    backgroundColor: Colors.orange,
  },
  sizes: {
    flexDirection: 'row',
    gap: 20,
    marginVertical: 20,
  },
  size: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#808080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeSize: {
    backgroundColor: Colors.orange,
    borderColor: Colors.orange,
  },
  sizeText: {
    color: '#808080',
    fontFamily: 'medium',
  },
  activeSizeText: {
    color: '#fff',
  },
  btn: {
    backgroundColor: '#FC6A03',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 20,
  },
  ptag: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'medium',
  },
})

const Page = () => {
  const router = useRouter()
  const { height } = useWindowDimensions()
  const [activeSize, setActiveSize] = useState(1)
  const { addToCart } = useCartStore()

  const images = [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
  ]

  const sizes = ['XS', 'S', 'M', 'L', 'XL']

  const product = {
    name: 'Comfort Fit Crew Neck',
    price: 88.77,
    description:
      'The Nike Throwback Pullover Hoodie is made from brushed-back fleece for a soft feel and features a vintage-inspired design with bold graphics.',
    sizesAvailable: ['XS', 'S', 'M', 'L', 'XL'],
  }

  const handleAddToCart = () => {
    addToCart({
      id: Math.floor(Math.random() * 1000),
      name: product.name,
      price: product.price,
      image: images[0],
      sizesAvailable: product.sizesAvailable,
    })
    router.push('/(modals)/cart')
  }

  return (
    <View style={defaultStyles.container}>
      <ScrollView>
        <SwiperFlatList
          data={images}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={[styles.image, { height: height * 0.45 }]} resizeMode="cover" />
          )}
          paginationStyleItem={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#fff',
          }}
          paginationStyle={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 10,
            borderRadius: 10,
          }}
          onScroll={({ index }) => setActiveIndex(index)}
        />

        <View style={{ padding: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 24, fontFamily: 'medium', textTransform: 'uppercase' }}>{product.name}</Text>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={22} color={Colors.orange} />
            </TouchableOpacity>
          </View>

          <Text style={{ color: '#808080', fontFamily: 'medium', fontSize: 16, marginVertical: 12 }}>
            Ready To Wear
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={{ fontFamily: 'medium', fontSize: 20 }}>${product.price}</Text>
            <Text style={{ color: '#808080', textDecorationLine: 'line-through' }}>$120.00</Text>
            <View
              style={{
                backgroundColor: Colors.orange,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: '#fff', fontFamily: 'medium' }}>-20%</Text>
            </View>
          </View>

          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={{ marginVertical: 20, fontFamily: 'regular', lineHeight: 20 }}>{product.description}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)}>
            <Text style={{ fontFamily: 'medium', fontSize: 18 }}>Size</Text>
            <View style={styles.sizes}>
              {sizes.map((size, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.size, activeSize === index && styles.activeSize]}
                  onPress={() => setActiveSize(index)}
                >
                  <Text style={[styles.sizeText, activeSize === index && styles.activeSizeText]}>{size}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600)} style={{ flexDirection: 'row', gap: 20 }}>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row' }}>
              <View
                style={{
                  flex: 1,
                  borderColor: '#808080',
                  borderWidth: 1,
                  borderRadius: 30,
                  paddingVertical: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="bookmark-outline" size={28} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flex: 4 }} onPress={handleAddToCart}>
              <View style={styles.btn}>
                <Text style={styles.ptag}>
                  Add To Cart <Ionicons name="cart-outline" size={16} />
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          backgroundColor: 'rgba(255,255,255,0.8)',
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.orange} />
      </TouchableOpacity>
    </View>
  )
}

export default Page
