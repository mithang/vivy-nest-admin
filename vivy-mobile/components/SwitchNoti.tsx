import * as Haptics from 'expo-haptics'
import React, { useState } from 'react'
import { Switch } from 'react-native'

const SwitchComponentNoti = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const onValueChange = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
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

export default SwitchComponentNoti

// Remove unused styles
