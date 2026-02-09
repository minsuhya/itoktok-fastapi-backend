import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

import { colors, radius, spacing, typography } from '@/lib/theme'

type TextFieldProps = {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  secureTextEntry?: boolean
}

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry
}: TextFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs
  },
  input: {
    backgroundColor: '#F5F6F7',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.textPrimary
  }
})
