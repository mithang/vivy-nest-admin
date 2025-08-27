// Learn more https://docs.expo.io/guides/customizing-metro
import { getDefaultConfig } from '@expo/metro-config'

const config = getDefaultConfig(__dirname)

// Enable CSS support (web-only)
config.transformer = {
  ...config.transformer,
  isCSSEnabled: true,
}

export default config
