import { SafeAreaView, StyleSheet } from 'react-native'

import data from '../../assets/data/data'
import Listing from '../../components/Listing'

import Popular from '../../components/Popular'
import SwiperHome from '../../components/SwiperHome'
import { View } from '../../components/Themed'

const filterItems = data.filter((item, i) => i < 8)

// Move styles to top
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})

export default function TabOneScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[{ paddingHorizontal: 15 }]}>
        <SwiperHome />
        <Listing data={filterItems} />
        <Popular data={filterItems} />
      </View>
    </SafeAreaView>
  )
}
