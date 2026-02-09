import React from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import * as Haptics from 'expo-haptics'

import { colors, radius, spacing, typography } from '@/lib/theme'

type ButtonProps = {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export default function Button({ title, onPress, variant = 'primary', disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={async () => {
        if (!disabled) {
          await Haptics.selectionAsync()
          onPress()
        }
      }}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null
      ]}
    >
      <Text style={[styles.text, variant === 'secondary' ? styles.textSecondary : styles.textPrimary]}>
        {title}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 }
  },
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.primarySoft
  },
  text: {
    ...typography.subtitle
  },
  textPrimary: {
    color: '#FFFFFF'
  },
  textSecondary: {
    color: colors.primary
  },
  pressed: {
    transform: [{ scale: 0.98 }]
  },
  disabled: {
    opacity: 0.6
  }
})
