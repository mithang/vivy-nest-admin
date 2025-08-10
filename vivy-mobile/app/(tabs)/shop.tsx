import React from 'react'
import { SafeAreaView } from 'react-native'
import ShopLisitng from '../../components/ShopLisitng'
import { View } from '../../components/Themed'
import { defaultStyles } from '../../constants/styles'

const Page = () => {
  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={[defaultStyles.container, { paddingTop: 30 }]}>
        <ShopLisitng />
      </View>
    </SafeAreaView>
  )
}

export default Page

// Remove unused styles
