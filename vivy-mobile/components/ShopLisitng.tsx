import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated as Ani,
  RefreshControl,
} from 'react-native'

import Animated, { FadeInDown } from 'react-native-reanimated'
import data from '../assets/data/data'
import Colors from '../constants/Colors'

import { Text } from './Themed'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: '100%',
    borderRadius: 5,
  },
  text: {
    fontFamily: 'bold',
    fontSize: 24,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
  },
  skeleton: {
    backgroundColor: '#808080',
    borderRadius: 5,
    width: width * 0.45,
    height: 300,
    margin: 5,
  },
})

const ShopLisitng = () => {
  const router = useRouter()
  const [refreshing, setRefreshing] = React.useState(false)
  const [maindata, setMainData] = React.useState(data)
  const [loading, setLoading] = React.useState(true) // Fix redeclare - keep only one
  const [animation] = React.useState(new Ani.Value(0)) // Remove unused setAnimation

  React.useEffect(() => {
    // Prefetch images when the component mounts
    const prefetchImages = async () => {
      try {
        const imagePromises = maindata.map(async (item) => {
          return Image.prefetch(item.image)
        })
        await Promise.all(imagePromises)
        setLoading(false) // Set loading to false after prefetching
      } catch (error) {
        console.error('Error prefetching images:', error)
      }
    }

    prefetchImages()
  }, [])

  React.useEffect(() => {
    Ani.loop(
      Ani.timing(animation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start()
  }, [])

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  })

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000) // Simulating a 2-second delay for data fetching
  }, [])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true)
    setLoading(true)
    const reversedData = [...maindata].reverse()
    setMainData(reversedData)
    setTimeout(() => {
      setRefreshing(false)
      setLoading(false)
    }, 3000)
  }, [maindata])

  const Skele = () => <Ani.View style={[styles.skeleton, { opacity }]} />

  return (
    <View style={{ marginTop: 20, padding: 10 }}>
      <FlatList
        refreshControl={
          <RefreshControl
            tintColor={Colors.orange}
            colors={[Colors.orange]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={maindata}
        numColumns={2}
        style={{ gap: 10 }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => {
          if (loading) {
            return <Skele />
          }
          return (
            //@ts-ignore
            <TouchableOpacity onPress={() => router.push(`products/${item.id}`)}>
              <Animated.View
                entering={FadeInDown}
                style={{ width: width * 0.45, marginVertical: 20, marginHorizontal: 5 }}
              >
                <View style={{ flexDirection: 'column', width: '100%' }}>
                  <Image
                    style={styles.image}
                    source={{ uri: item.image }}
                    // In the Image component, replace the require with import:
                    // loadingIndicatorSource={loadingGif}
                  />

                  {/* <Text style={{ fontFamily: "bold", fontSize: 30}}>
                    Winter Fashion
                </Text> */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                    <Text style={{ color: Colors.orange, fontFamily: 'medium', fontSize: 22 }}>${item.price}</Text>
                    <TouchableOpacity>
                      <Text>
                        <Ionicons name="bookmark-outline" size={20} />
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={{ fontFamily: 'medium', fontSize: 18 }}>{item.description}</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export default ShopLisitng
