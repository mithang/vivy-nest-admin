import * as Haptics from 'expo-haptics'
import React, { useState } from 'react'
import { Switch, Appearance } from 'react-native'

const SwitchComponent = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const colorScheme = Appearance.getColorScheme()

  const onValueChange = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    if (colorScheme === 'dark') {
      Appearance.setColorScheme('light')
    } else {
      Appearance.setColorScheme('dark')
    }
    setIsEnabled((previousState) => !previousState)
  }

  return (
    <Switch
      trackColor={{ false: 'gray', true: 'green' }}
      thumbColor={isEnabled ? '#fff' : '#111'}
      ios_backgroundColor="#3e3e3e"
      onValueChange={onValueChange}
      value={isEnabled}
    />
  )
}

export default SwitchComponent
