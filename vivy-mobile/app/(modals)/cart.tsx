import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { FlatList, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native'

import Animated, { FadeInDown } from 'react-native-reanimated'
import { Text, View } from '../../components/Themed'
import Colors from '../../constants/Colors'
import { defaultStyles } from '../../constants/styles'
import { useCartStore } from '../../context/context'

// Move styles definition to the top, before the component
const styles = StyleSheet.create({
  image: {
    height: 150,
    width: 150,
    borderRadius: 5,
    //   resizeMode: "contain"
  },
  button: {
    backgroundColor: '#FC6A03',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 100,
  },
  ptag: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'medium',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})

const Page = () => {
  const { cartList, deleteFromCart } = useCartStore()

  return (
    <View style={defaultStyles.container}>
      {cartList.length > 0 ? (
        <>
          <FlatList
            data={cartList}
            style={{ gap: 10, padding: 5 }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                //@ts-ignore
                <TouchableOpacity>
                  <Animated.View entering={FadeInDown} style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image style={styles.image} source={{ uri: item.image }} />

                      <View style={{ flex: 1, paddingLeft: 10 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontFamily: 'medium', fontSize: 24, textTransform: 'uppercase' }}>
                            {item.name}
                          </Text>
                          <TouchableOpacity onPress={() => deleteFromCart(item.id)}>
                            <Ionicons name="trash" size={20} color={Colors.orange} />
                          </TouchableOpacity>
                        </View>
                        <Text style={{ color: '#808080', fontFamily: 'medium', fontSize: 16, marginVertical: 12 }}>
                          Ready To Wear
                        </Text>
                        <Text style={{ color: '#808080', fontFamily: 'medium', fontSize: 16, marginVertical: 12 }}>
                          Size {item.sizesAvailable[1]}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontFamily: 'medium', fontSize: 20 }}>${item.price}</Text>
                          <Pressable style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                              style={{
                                borderColor: '#808080',
                                borderWidth: 1,
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Text style={{ textAlign: 'center' }}>
                                <AntDesign name="minus" size={24} />
                              </Text>
                            </TouchableOpacity>

                            <View
                              style={{
                                borderColor: '#808080',
                                borderWidth: 1,
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Text style={{ fontSize: 30, textAlign: 'center' }}>0</Text>
                            </View>
                            <TouchableOpacity
                              style={{
                                borderColor: '#808080',
                                borderWidth: 1,
                                width: 30,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Text style={{ textAlign: 'center' }}>
                                <Ionicons name="add" size={24} />
                              </Text>
                            </TouchableOpacity>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                </TouchableOpacity>
              )
            }}
          />

          <View style={{ padding: 10, paddingBottom: 20, gap: 10, borderTopColor: '#808080', borderTopWidth: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#808080', fontFamily: 'medium', fontSize: 16 }}>Subtotal</Text>
              <Text style={{ color: '#808080', fontFamily: 'medium', fontSize: 16 }}>88.77 USD</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: '#808080', fontFamily: 'medium', fontSize: 16 }}>Shipping Fee</Text>
              <Text style={{ color: '#808080', fontFamily: 'medium', fontSize: 16 }}>Standard - Fee</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: 'medium', fontSize: 16 }}>Estimated Fee</Text>
              <Text style={{ fontFamily: 'medium', fontSize: 16 }}>88.77 USD + tax</Text>
            </View>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.ptag}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.container}>
            <Text>
              <MaterialIcons name="remove-shopping-cart" size={44} />
            </Text>
            <Text style={styles.title}>No Item In the cart.</Text>
          </View>
        </>
      )}
    </View>
  )
}

export default Page
