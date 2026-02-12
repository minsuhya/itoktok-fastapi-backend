import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { TeacherInfo } from '@/lib/api/users'
import { colors, spacing, typography } from '@/lib/theme'

type TeacherFilterChipsProps = {
  teachers: TeacherInfo[]
  selectedTeacherSet: Set<string>
  onToggleTeacher: (username: string) => void
  onSelectAll: () => void
}

export default function TeacherFilterChips({
  teachers,
  selectedTeacherSet,
  onToggleTeacher,
  onSelectAll
}: TeacherFilterChipsProps) {
  if (teachers.length === 0) {
    return null
  }

  const isAllSelected = teachers.every((teacher) => selectedTeacherSet.has(teacher.username))

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        <TouchableOpacity
          onPress={onSelectAll}
          style={[styles.chip, isAllSelected ? styles.chipSelected : styles.chipUnselected]}
        >
          <Text style={[styles.text, isAllSelected ? styles.textSelected : styles.textUnselected]}>전체</Text>
        </TouchableOpacity>

        {teachers.map((teacher) => {
          const selected = selectedTeacherSet.has(teacher.username)
          return (
            <TouchableOpacity
              key={teacher.username}
              onPress={() => onToggleTeacher(teacher.username)}
              style={[
                styles.chip,
                selected ? styles.chipSelected : styles.chipUnselected,
                selected && teacher.usercolor ? { borderColor: teacher.usercolor } : null
              ]}
            >
              <Text style={[styles.text, selected ? styles.textSelected : styles.textUnselected]}>
                {teacher.full_name || teacher.username}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md
  },
  content: {
    paddingRight: spacing.md,
    alignItems: 'center'
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    marginRight: spacing.sm,
    borderWidth: 1
  },
  chipSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border
  },
  text: {
    ...typography.caption
  },
  textSelected: {
    color: colors.primary
  },
  textUnselected: {
    color: colors.textSecondary
  }
})
