import { Entypo, Ionicons } from '@expo/vector-icons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, Tabs } from 'expo-router'
import { Pressable, Text, View, useColorScheme } from 'react-native'

import Colors from '../../constants/Colors'
import { useCartStore } from '../../context/context'

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const { cartList } = useCartStore()

  console.log(cartList.length)

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.orange,
        headerTransparent: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',

          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerRight: () => (
            <Link href="/(modals)/cart" asChild style={{ position: 'relative' }}>
              <Pressable>
                {({ pressed }) => (
                  <View>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 14,
                        zIndex: 10,
                        right: 6,
                        backgroundColor: 'red',
                        width: 20,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ color: 'white', textAlign: 'center' }}>{cartList.length}</Text>
                    </View>
                    <Ionicons
                      name="cart-outline"
                      size={22}
                      color={Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1, position: 'relative' }}
                      // children={<View style={{ position: "relative", backgroundColor: "red" }}>
                      //   <Text style={{color: "#fff"}} >{cartList.length}</Text>
                      // </View>}
                    />
                  </View>
                )}
              </Pressable>
            </Link>
          ),
          headerLeft: () => (
            <Link href="/(modals)/cart" asChild>
              <Pressable style={{ paddingHorizontal: 10 }}>
                {({ pressed }) => (
                  <Ionicons
                    name="search"
                    size={22}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <Entypo name="shop" size={24} color={color} />,
          headerRight: () => (
            <Link href="/(modals)/cart" asChild>
              <Pressable>
                {({ pressed }) => (
                  <View>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 14,
                        zIndex: 10,
                        right: 6,
                        backgroundColor: 'red',
                        width: 20,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ color: 'white', textAlign: 'center' }}>{cartList.length}</Text>
                    </View>
                    <Ionicons
                      name="cart-outline"
                      size={22}
                      color={Colors[colorScheme ?? 'light'].text}
                      style={{ marginRight: 15, opacity: pressed ? 0.5 : 1, position: 'relative' }}
                      // children={<View style={{ position: "relative", backgroundColor: "red" }}>
                      //   <Text style={{color: "#fff"}} >{cartList.length}</Text>
                      // </View>}
                    />
                  </View>
                )}
              </Pressable>
            </Link>
          ),
          headerLeft: () => (
            <Link href="/(modals)/cart" asChild>
              <Pressable style={{ paddingHorizontal: 10 }}>
                {({ pressed }) => (
                  <Ionicons
                    name="search"
                    size={22}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <Ionicons name="bookmark-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  )
}
