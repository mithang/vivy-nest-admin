import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useLayoutEffect } from 'react'
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

import Animated, {
  SlideInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated'

// Remove unused import: data
import { Text, View } from '../../components/Themed'
import Colors from '../../constants/Colors'
import { defaultStyles } from '../../constants/styles'
import { useCartStore } from '../../context/context'

const IMG_HEIGHT = 300
const { width } = Dimensions.get('window')

// Move styles to top
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    color: 'white',
    fontSize: 20,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'medium',
  },
  btn: {
    backgroundColor: '#FC6A03',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    position: 'absolute',
    bottom: 0,
    height: 70,
    width: '100%',
  },
  image: {
    height: IMG_HEIGHT,
    width: width,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: 'white',
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'bold',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  footer: {
    height: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: 'medium',
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.orange,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  header: {
    backgroundColor: 'rgba(0, 0 , 0, 0.5)',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'regular',
    lineHeight: 22,
  },
})

const DetailsPage = () => {
  // Remove unused variables: id, navigation, item, setItem
  const router = useRouter()
  const scrollRef = useAnimatedRef<Animated.ScrollView>()
  const scrollOffset = useScrollViewOffset(scrollRef)
  const { cartList, addToCart } = useCartStore()

  // Move headerAnimatedStyle to top, after hooks
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
    }
  })

  const onCart = () => {
    router.push('/(modals)/cart')
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerTransparent: true,
      headerBackground: () => <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>,
      headerRight: () => (
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={22} color={Colors.orange} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.roundButton} onPress={onCart}>
            <View
              style={{
                position: 'absolute',
                bottom: 24,
                zIndex: 10,
                right: 0,
                backgroundColor: 'black',
                width: 20,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>{cartList.length}</Text>
            </View>
            <Ionicons name="cart-outline" size={22} color={Colors.orange} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.orange} />
        </TouchableOpacity>
      ),
    })
  }, [])

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT, IMG_HEIGHT],
            [IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
        },
      ],
    }
  })

  return (
    <View style={defaultStyles.container}>
      <Animated.ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 100 }} scrollEventThrottle={16}>
        <Animated.Image
          source={{ uri: product.image }}
          style={[styles.image, imageAnimatedStyle]}
          resizeMode={'cover'}
        />
        <View style={styles.infoContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 20, marginVertical: 10 }}>
              {product.sizesAvailable.map((item: string, i: number) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setActive(i)}
                  style={{
                    backgroundColor: '#ddd',
                    borderColor: active === i ? Colors.orange : '#ddd',
                    borderWidth: 1,
                    width: 100,
                    padding: 15,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: active === i ? '#fff' : '#111', fontSize: 24, fontFamily: 'medium' }}>
                    &nbsp;
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <Text style={{ color: '#808080', fontSize: 16 }}>READY TO WEAR</Text>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5 }}
          >
            <View>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={{ color: Colors.orange, fontFamily: 'medium', fontSize: 22 }}>${product.price}</Text>
            </View>
            <TouchableOpacity>
              <Text>
                <Ionicons name="bookmark-outline" size={28} />
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={{ flexDirection: 'row', gap: 20 }}>
            {product.sizesAvailable.map((item: string, i: number) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActive(i)}
                style={{
                  backgroundColor: active === i ? Colors.orange : '#ddd',
                  minWidth: 70,
                  padding: 15,
                  borderRadius: 30,
                }}
              >
                <Text
                  style={{
                    color: active === i ? '#fff' : '#111',
                    fontSize: 24,
                    fontFamily: 'medium',
                    textAlign: 'center',
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam deserunt debitis ad ducimus reprehenderit
            sit nulla aliquam voluptatibus magni, officiis incidunt fugit labore facere aut placeat cupiditate officia.
            Porro. orem ipsum dolor sit amet, consectetur adipisicing elit. Magnam deserunt debitis ad ducimus
            reprehenderit sit nulla aliquam voluptatibus magni, officiis incidunt fugit labore facere aut placeat
            cupiditate officia. Porro. orem ipsum dolor sit amet, consectetur adipisicing elit. Magnam deserunt debitis
            ad ducimus reprehenderit sit nulla aliquam voluptatibus magni, officiis incidunt fugit labore facere aut
            placeat cupiditate officia. Porro.
          </Text>
        </View>
      </Animated.ScrollView>
      {/* <AddToCart  /> */}
      <Animated.View style={styles.footerText} entering={SlideInDown.delay(300)}>
        <TouchableOpacity style={styles.btn} onPress={() => addToCart(product)}>
          <Text style={styles.text}>
            Add To Cart <Ionicons name="cart-outline" size={16} />
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default DetailsPage
