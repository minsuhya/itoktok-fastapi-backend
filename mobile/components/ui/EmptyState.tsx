import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { colors, spacing, typography } from '@/lib/theme'

type EmptyStateProps = {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.xxl,
    alignItems: 'center'
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center'
  }
})
