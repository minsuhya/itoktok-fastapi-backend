import React from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { colors } from '@/lib/theme'

type ScreenProps = {
  children: React.ReactNode
  backgroundColor?: string
}

export default function Screen({ children, backgroundColor = colors.background }: ScreenProps) {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1
  },
  container: {
    flex: 1
  }
})
