import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import Colors from '../constants/Colors'
import { Text, View } from './Themed'

// Move styles to top
const styles = StyleSheet.create({
  text: {
    fontFamily: 'bold',
    fontSize: 24,
  },
})

const Popular = ({ data }: any) => {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.text}>Popular</Text>

      <FlatList
        style={{ marginTop: 10 }}
        data={data}
        renderItem={({ item }) => (
          <View style={{ width: 250, marginRight: 30 }}>
            <View style={{ flexDirection: 'column', width: '100%' }}>
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
    </View>
  )
}

export default Popular
