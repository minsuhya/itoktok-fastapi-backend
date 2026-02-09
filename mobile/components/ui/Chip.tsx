import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'

import { colors, radius, spacing, typography } from '@/lib/theme'

type ChipProps = {
  label: string
  selected?: boolean
  onPress: () => void
}

export default function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, selected ? styles.selected : styles.unselected]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textUnselected]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
    marginBottom: spacing.sm
  },
  selected: {
    backgroundColor: colors.primary
  },
  unselected: {
    backgroundColor: colors.primarySoft
  },
  text: {
    ...typography.caption
  },
  textSelected: {
    color: '#FFFFFF'
  },
  textUnselected: {
    color: colors.primary
  }
})
