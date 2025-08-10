import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useRef, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native'
import Ripple from 'react-native-material-ripple'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  // Remove unused withTiming
  interpolate,
  Extrapolate,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'

const isAndroid = Platform.OS === 'android'
const { width } = Dimensions.get('window')

// Move styles to top
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isAndroid ? 10 : '18%',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  col: {
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  addToCartBtn: {
    backgroundColor: '#251B37',
    borderRadius: 10,
    paddingVertical: 10,
  },
  circle: {
    width: 20,
    height: 20,
    backgroundColor: '#251B37',
    borderRadius: 50,
    position: 'absolute',
    right: '30%',
    bottom: '25%',
    zIndex: -1,
  },
})

// Move AnimatedCircle definition to top
const AnimatedCircleMemo = ({ onRotateEnd, index, onInit }: any) => {
  const addToCartAnim = useSharedValue(0)
  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(addToCartAnim.value, [0, 1], [0, -width], Extrapolate.CLAMP)
    const translateY = interpolate(addToCartAnim.value, [0, 1], [0, -50], Extrapolate.CLAMP)
    return {
      transform: [{ translateX }, { translateY }],
    }
  })

  useEffect(() => {
    onInit(addToCartAnim)
  }, [])
  return <Animated.View style={[style.circle, animatedStyle]} />
}

const MEMO = (prev: any, next: any) => {
  return next.itemQuantity !== prev.itemQuantity ? false : true
}

const AnimatedCircle = React.memo(AnimatedCircleMemo, MEMO)

const AddToCart = () => {
  const cartCounter = useSharedValue(0)
  const bounceCart = useSharedValue(0)
  const [cart, setCart] = useState(0)

  const animRef = useRef({ counter: 0, anims: [] })

  const cartCounterStyle = useAnimatedStyle(() => {
    return {
      // opacity: cartCounter.value,
      transform: [{ scale: cartCounter.value }],
    }
  })

  const cartStyle = useAnimatedStyle(() => {
    const tranX = interpolate(bounceCart.value, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, -20, 20, -20, 20, 0], {
      extrapolateLeft: Extrapolate.CLAMP,
      extrapolateRight: Extrapolate.CLAMP,
    })
    return {
      transform: [{ translateX: withSpring(tranX) }],
    }
  })

  const counterRef = useRef(0)
  const startedRef = useRef(false)

  const increment = () => {
    setCart(counterRef.current)
  }

  const addToCartAnim = () => {
    // 'worklet';
    cartCounter.value = 0
    counterRef.current += 1
    cartCounter.value = withSpring(1, { duration: 600 }, (done) => {
      if (done) runOnJS(increment)()
    })
  }

  const saveAnimFunc = (func) => {
    animRef?.current?.anims?.push(func)
  }

  const handleAddToCart = () => {
    startedRef.current = true
    const jump = animRef.current.anims[animRef.current.counter]
    if (jump) jump()
    if (animRef.current.counter > 5) {
      animRef.current.counter = 0
    } else {
      animRef.current.counter += 1
    }
  }
  return (
    <>
      <View style={style.row}>
        <View
          style={[
            style.col,
            {
              alignItems: 'center',
              width: '30%',
            },
          ]}
        >
          <Animated.View style={[{ position: 'relative' }, cartStyle]}>
            <Ionicons name="ios-cart-outline" color="black" size={30} />
            <Animated.View
              style={[
                style.circle,
                cartCounterStyle,
                {
                  top: -3,
                  right: -4,
                  zIndex: 2,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>{cart}</Text>
            </Animated.View>
          </Animated.View>
        </View>
        <View style={{ width: '50%' }}>
          <Ripple onPress={handleAddToCart} style={[style.col, style.addToCartBtn]}>
            <View>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                Add To Cart
              </Text>

              <AnimatedCircle index={1} key={1} itemQuantity={1} onRotateEnd={addToCartAnim} onInit={saveAnimFunc} />
              <AnimatedCircle index={2} key={2} itemQuantity={2} onRotateEnd={addToCartAnim} onInit={saveAnimFunc} />
              <AnimatedCircle index={3} key={3} itemQuantity={3} onRotateEnd={addToCartAnim} onInit={saveAnimFunc} />
              <AnimatedCircle index={4} key={4} itemQuantity={4} onRotateEnd={addToCartAnim} onInit={saveAnimFunc} />
              <AnimatedCircle index={5} key={5} itemQuantity={5} onRotateEnd={addToCartAnim} onInit={saveAnimFunc} />
              <AnimatedCircle index={6} key={6} itemQuantity={6} onRotateEnd={addToCartAnim} onInit={saveAnimFunc} />

              <AnimatedCircle index={7} key={7} itemQuantity={7} onRotateEnd={addToCartAnim} onInit={saveAnimFunc} />

              <AnimatedCircle index={8} key={8} itemQuantity={8} onRotateEnd={addToCartAnim} onInit={saveAnimFunc} />
            </View>
          </Ripple>
        </View>
      </View>
    </>
  )
}

export default AddToCart
export { AnimatedCircleMemo }
