import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

import { colors, radius, spacing } from '@/lib/theme'

export default function Card({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 }
  }
})
