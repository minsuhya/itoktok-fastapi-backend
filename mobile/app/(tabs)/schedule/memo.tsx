import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { colors, spacing, typography } from '@/lib/theme'
import { getSchedule, normalizeRepeatDays, ScheduleDetail, updateSchedule } from '@/lib/api/schedules'
import { toApiErrorMessage } from '@/lib/api/utils'

export default function ScheduleMemoScreen() {
  const router = useRouter()
  const { schedule_list_id } = useLocalSearchParams<{ schedule_list_id?: string }>()
  const [memo, setMemo] = useState('')
  const [detail, setDetail] = useState<ScheduleDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      if (!schedule_list_id) return

      setIsLoading(true)
      try {
        const data = await getSchedule(Number(schedule_list_id))
        if (isMounted) {
          setDetail(data)
          setMemo(data.schedule_memo || data.schedule?.memo || '')
          setError('')
        }
      } catch (loadError) {
        if (isMounted) {
          setDetail(null)
          setError(toApiErrorMessage(loadError, '일정 메모를 불러오지 못했습니다.'))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [schedule_list_id])

  const handleSave = async () => {
    if (!detail || isSaving) return

    setIsSaving(true)
    setError('')
    const repeatDays = normalizeRepeatDays(detail.schedule?.repeat_days)
    try {
      await updateSchedule(detail.schedule_id, detail.id, {
        teacher_username: detail.schedule?.teacher_username || detail.teacher_username,
        client_id: detail.schedule?.client_id || detail.client_id,
        program_id: detail.schedule?.program_id || detail.program_id,
        schedule_type: detail.schedule?.schedule_type || 1,
        start_date: detail.schedule?.start_date,
        finish_date: detail.schedule?.finish_date,
        start_time: detail.schedule?.start_time,
        finish_time: detail.schedule?.finish_time,
        repeat_type: detail.schedule?.repeat_type || 1,
        repeat_days: repeatDays,
        schedule_status: detail.schedule_status || '1',
        update_range: 'single',
        memo
      })
      router.back()
    } catch (saveError) {
      setError(toApiErrorMessage(saveError, '메모를 저장하지 못했습니다.'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Screen backgroundColor={colors.surface}>
      <ScrollView contentContainerStyle={styles.container}>
        <SectionHeader title="상담 메모" subtitle="기록은 상담 품질을 높입니다." />

        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>상담 메모를 불러오는 중입니다...</Text>
          </View>
        ) : null}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Card style={styles.card}>
          <Text style={styles.label}>내담자</Text>
          <Text style={styles.value}>{detail?.clientinfo?.client_name || '내담자'}</Text>
          <Text style={styles.label}>상담사</Text>
          <Text style={styles.value}>{detail?.teacher_username || '-'}</Text>
        </Card>
        <Text style={styles.label}>메모</Text>
        <TextInput
          value={memo}
          onChangeText={setMemo}
          placeholder="오늘의 상담 내용을 기록하세요"
          multiline
          style={styles.input}
        />
        <View style={styles.actions}>
          <Button title={isSaving ? '저장 중...' : '저장'} onPress={handleSave} disabled={isSaving || isLoading} />
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg
  },
  card: {
    marginBottom: spacing.lg
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
  errorText: {
    ...typography.body,
    color: colors.danger,
    marginBottom: spacing.md
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm
  },
  value: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  input: {
    minHeight: 160,
    borderRadius: 20,
    backgroundColor: '#F5F6F7',
    padding: spacing.md,
    textAlignVertical: 'top',
    ...typography.body,
    color: colors.textPrimary
  },
  actions: {
    marginTop: spacing.xl
  }
})
