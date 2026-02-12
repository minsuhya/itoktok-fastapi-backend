import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import TextField from '@/components/ui/TextField'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import { colors, spacing, typography } from '@/lib/theme'
import { createProgram, getProgram, updateProgram } from '@/lib/api/programs'
import { getTeachers } from '@/lib/api/users'
import { toApiErrorMessage } from '@/lib/api/utils'

type TeacherOption = {
  username: string
  full_name: string
}

const PROGRAM_TYPES = ['미술', '음악', '무용', '기타']

export default function ProgramFormScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const [programType, setProgramType] = useState('')
  const [programName, setProgramName] = useState('')
  const [isAllTeachers, setIsAllTeachers] = useState(false)
  const [teacherUsername, setTeacherUsername] = useState('')
  const [description, setDescription] = useState('')
  const [teachers, setTeachers] = useState<TeacherOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isEditMode = useMemo(() => Boolean(id), [id])

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const teacherItems = await getTeachers()
        setTeachers(Array.isArray(teacherItems) ? teacherItems : [])

        if (id) {
          const detail = await getProgram(Number(id))
          setProgramType(detail.program_type || '')
          setProgramName(detail.program_name || '')
          setIsAllTeachers(Boolean(detail.is_all_teachers))
          setTeacherUsername(detail.teacher_username || '')
          setDescription(detail.description || '')
        }

        setError('')
      } catch (loadError) {
        setTeachers([])
        setError(toApiErrorMessage(loadError, '프로그램 정보를 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [id])

  const handleSubmit = async () => {
    if (isSubmitting) {
      return
    }

    if (!programType) {
      setError('프로그램 유형을 선택해주세요.')
      return
    }

    if (!programName.trim()) {
      setError('프로그램명을 입력해주세요.')
      return
    }

    if (!isAllTeachers && !teacherUsername) {
      setError('담당 선생님을 선택해주세요.')
      return
    }

    setIsSubmitting(true)
    setError('')

    const payload = {
      program_type: programType,
      program_name: programName.trim(),
      is_all_teachers: isAllTeachers,
      teacher_username: isAllTeachers ? null : teacherUsername,
      description
    }

    try {
      if (id) {
        await updateProgram(Number(id), payload)
      } else {
        await createProgram(payload)
      }
      router.back()
    } catch (submitError) {
      setError(toApiErrorMessage(submitError, '프로그램을 저장하지 못했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Screen backgroundColor={colors.surface}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <SectionHeader
          title={isEditMode ? '프로그램 수정' : '프로그램 등록'}
          subtitle={isEditMode ? '기존 프로그램 정보를 수정하세요.' : '새 프로그램 정보를 입력하세요.'}
        />

        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>기본 정보를 불러오는 중입니다...</Text>
          </View>
        ) : null}

        <Text style={styles.label}>프로그램 유형</Text>
        <View style={styles.chipRow}>
          {PROGRAM_TYPES.map((type) => (
            <Chip key={type} label={type} selected={programType === type} onPress={() => setProgramType(type)} />
          ))}
        </View>

        <TextField
          label="프로그램명"
          value={programName}
          onChangeText={setProgramName}
          placeholder="프로그램명을 입력하세요"
        />

        <Text style={styles.label}>담당 선생님</Text>
        <View style={styles.chipRow}>
          <Chip
            label="전체 선생님"
            selected={isAllTeachers}
            onPress={() => {
              setIsAllTeachers((prev) => {
                const next = !prev
                if (next) {
                  setTeacherUsername('')
                }
                return next
              })
            }}
          />
        </View>

        {!isAllTeachers ? (
          <View style={styles.chipRow}>
            {teachers.map((teacher) => (
              <Chip
                key={teacher.username}
                label={teacher.full_name}
                selected={teacherUsername === teacher.username}
                onPress={() => setTeacherUsername(teacher.username)}
              />
            ))}
          </View>
        ) : null}

        {!isLoading && !isAllTeachers && teachers.length === 0 ? (
          <Text style={styles.helperText}>선택 가능한 선생님이 없습니다.</Text>
        ) : null}

        <TextField
          label="프로그램 설명"
          value={description}
          onChangeText={setDescription}
          placeholder="프로그램 설명 (선택)"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.actions}>
          <Button
            title={isSubmitting ? '저장 중...' : '저장'}
            onPress={handleSubmit}
            disabled={isSubmitting || isLoading}
          />
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md
  },
  helperText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: -spacing.xs,
    marginBottom: spacing.md
  },
  errorText: {
    ...typography.body,
    color: colors.danger,
    marginBottom: spacing.md
  },
  actions: {
    marginTop: spacing.md
  }
})
