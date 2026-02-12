import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import TextField from '@/components/ui/TextField'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import { colors, spacing, typography } from '@/lib/theme'
import { searchClients } from '@/lib/api/clients'
import { getTeachers } from '@/lib/api/users'
import { getPrograms } from '@/lib/api/programs'
import { createSchedule, deleteSchedule, getSchedule, normalizeRepeatDays, updateSchedule } from '@/lib/api/schedules'
import type { ScheduleDetail } from '@/lib/api/schedules'
import { toApiErrorMessage } from '@/lib/api/utils'

type ClientOption = {
  id: number
  name: string
  phone?: string
}

type TeacherOption = {
  username: string
  name: string
}

type ProgramOption = {
  id: number
  name: string
}

type EditMeta = {
  scheduleListId: number
  scheduleId: number
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0]
}

function isValidDateString(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) {
    return false
  }

  const parsed = new Date(year, month - 1, day)
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  )
}

export default function ScheduleFormScreen() {
  const router = useRouter()
  const { date, schedule_list_id, schedule_id } = useLocalSearchParams<{
    date?: string
    schedule_list_id?: string
    schedule_id?: string
  }>()
  const [clientName, setClientName] = useState('')
  const [clientId, setClientId] = useState<number | null>(null)
  const [teacher, setTeacher] = useState('')
  const [programId, setProgramId] = useState<number | null>(null)
  const [memo, setMemo] = useState('')
  const [clientOptions, setClientOptions] = useState<ClientOption[]>([])
  const [teacherOptions, setTeacherOptions] = useState<TeacherOption[]>([])
  const [programOptions, setProgramOptions] = useState<ProgramOption[]>([])
  const [selectedStart, setSelectedStart] = useState('10:00')
  const [selectedEnd, setSelectedEnd] = useState('10:50')
  const [updateRange, setUpdateRange] = useState<'single' | 'all'>('single')
  const [editMeta, setEditMeta] = useState<EditMeta | null>(null)
  const [editDetail, setEditDetail] = useState<ScheduleDetail | null>(null)
  const [isOptionsLoading, setIsOptionsLoading] = useState(true)
  const [isEditLoading, setIsEditLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [screenError, setScreenError] = useState('')
  const [formError, setFormError] = useState('')

  const isEditMode = Boolean(schedule_list_id && schedule_id)
  const initialDate = typeof date === 'string' ? date : getTodayDate()
  const [selectedDate, setSelectedDate] = useState(initialDate)

  const timeOptions = useMemo(() => {
    const options = [] as string[]
    for (let hour = 9; hour <= 18; hour += 1) {
      for (let min = 0; min < 60; min += 10) {
        options.push(`${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`)
      }
    }
    return options
  }, [])

  useEffect(() => {
    const load = async () => {
      setIsOptionsLoading(true)
      try {
        const [teachersResponse, programsResponse] = await Promise.all([getTeachers(), getPrograms()])
        setTeacherOptions((teachersResponse || []).map((item) => ({
          username: item.username,
          name: item.full_name
        })))
        setProgramOptions((programsResponse?.items || []).map((item) => ({
          id: item.id,
          name: item.program_name
        })))
        setScreenError('')
      } catch (error) {
        setTeacherOptions([])
        setProgramOptions([])
        setScreenError(toApiErrorMessage(error, '일정 입력에 필요한 기본 정보를 불러오지 못했습니다.'))
      } finally {
        setIsOptionsLoading(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    const loadEdit = async () => {
      if (!schedule_list_id || !schedule_id) return
      setIsEditLoading(true)
      try {
        const detail = await getSchedule(Number(schedule_list_id))
        setClientName(detail.clientinfo?.client_name || '')
        setClientId(detail.client_id || null)
        setTeacher(detail.teacher_username || '')
        setProgramId(detail.program_id || null)
        setSelectedStart(detail.schedule?.start_time || detail.schedule_time || '10:00')
        setSelectedEnd(detail.schedule?.finish_time || detail.schedule_finish_time || '10:50')
        setSelectedDate(detail.schedule_date || detail.schedule?.start_date || initialDate)
        setMemo(detail.schedule_memo || detail.schedule?.memo || '')
        setEditMeta({
          scheduleListId: detail.id || Number(schedule_list_id),
          scheduleId: detail.schedule_id || Number(schedule_id)
        })
        setEditDetail(detail)
        setScreenError('')
      } catch (error) {
        setScreenError(toApiErrorMessage(error, '수정할 일정을 불러오지 못했습니다.'))
      } finally {
        setIsEditLoading(false)
      }
    }

    loadEdit()
  }, [schedule_list_id, schedule_id, initialDate])

  useEffect(() => {
    let isMounted = true
    const search = async () => {
      if (clientName.trim().length < 2) {
        setClientOptions([])
        return
      }
      try {
        const response = await searchClients(clientName.trim())
        const items = response?.items || []
        if (isMounted) {
          setClientOptions(items.map((item) => ({
            id: item.id,
            name: item.client_name,
            phone: item.phone_number
          })))
        }
      } catch {
        if (isMounted) {
          setClientOptions([])
        }
      }
    }

    search()
    return () => {
      isMounted = false
    }
  }, [clientName])

  useEffect(() => {
    setSelectedDate(initialDate)
  }, [initialDate])

  const handleSubmit = async () => {
    if (isSubmitting) return

    if (!clientId) {
      setFormError('내담자를 선택해주세요.')
      return
    }

    if (!teacher) {
      setFormError('상담사를 선택해주세요.')
      return
    }

    if (!programId) {
      setFormError('프로그램을 선택해주세요.')
      return
    }

    if (selectedStart >= selectedEnd) {
      setFormError('종료 시간은 시작 시간보다 늦어야 합니다.')
      return
    }

    if (!isValidDateString(selectedDate)) {
      setFormError('날짜 형식은 YYYY-MM-DD 이어야 합니다.')
      return
    }

    setFormError('')
    setIsSubmitting(true)

    try {
      if (editMeta) {
        const repeatDays = normalizeRepeatDays(editDetail?.schedule?.repeat_days)
        await updateSchedule(editMeta.scheduleId, editMeta.scheduleListId, {
          teacher_username: teacher,
          client_id: clientId,
          program_id: programId,
          schedule_type: editDetail?.schedule?.schedule_type || 1,
          start_date: selectedDate,
          finish_date: selectedDate,
          start_time: selectedStart,
          finish_time: selectedEnd,
          repeat_type: editDetail?.schedule?.repeat_type || '2',
          repeat_days: repeatDays,
          schedule_status: '1',
          update_range: updateRange,
          memo
        })
        router.back()
        return
      }

      await createSchedule({
        teacher_username: teacher,
        client_id: clientId,
        client_name: clientName,
        program_id: programId,
        start_date: selectedDate,
        finish_date: selectedDate,
        start_time: selectedStart,
        finish_time: selectedEnd,
        repeat_type: '2',
        repeat_days: {
          mon: true,
          tue: false,
          wed: false,
          thu: false,
          fri: false,
          sat: false,
          sun: false
        },
        memo
      })
      router.back()
    } catch (error) {
      setFormError(toApiErrorMessage(error, '일정을 저장하지 못했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!editMeta) return

    setIsSubmitting(true)
    setFormError('')
    try {
      await deleteSchedule(editMeta.scheduleId, editMeta.scheduleListId, updateRange)
      router.back()
    } catch (error) {
      setFormError(toApiErrorMessage(error, '일정을 삭제하지 못했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = () => {
    if (!editMeta || isSubmitting) return

    const message =
      updateRange === 'all'
        ? '선택한 일정 이후의 반복 일정까지 삭제됩니다. 진행할까요?'
        : '선택한 일정을 삭제하시겠어요?'

    Alert.alert('일정 삭제', message, [
      {
        text: '취소',
        style: 'cancel'
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => {
          void confirmDelete()
        }
      }
    ])
  }

  return (
    <Screen backgroundColor={colors.surface}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <SectionHeader
          title={editMeta ? '일정 수정' : '일정 등록'}
          subtitle={editMeta ? '기존 상담 일정을 수정하세요.' : '새로운 상담 일정을 입력하세요.'}
        />

        {screenError ? <Text style={styles.errorText}>{screenError}</Text> : null}

        {(isOptionsLoading || isEditLoading) && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>{isEditMode ? '일정을 불러오는 중...' : '기본 정보를 불러오는 중...'}</Text>
          </View>
        )}

        <Text style={styles.dateText}>선택 날짜: {selectedDate}</Text>
        <TextField
          label="일정 날짜 (YYYY-MM-DD)"
          value={selectedDate}
          onChangeText={setSelectedDate}
          placeholder="2026-01-31"
        />

        {editMeta ? (
          <>
            <Text style={styles.label}>수정 범위</Text>
            <View style={styles.chipRow}>
              <Chip
                label="이번 일정만"
                selected={updateRange === 'single'}
                onPress={() => setUpdateRange('single')}
              />
              <Chip
                label="이후 일정 전체"
                selected={updateRange === 'all'}
                onPress={() => setUpdateRange('all')}
              />
            </View>
          </>
        ) : null}

        <TextField label="내담자" value={clientName} onChangeText={setClientName} placeholder="이름 검색" />
        <View style={styles.chipRow}>
          {clientOptions.map((option) => (
            <Chip
              key={option.id}
              label={option.name}
              selected={clientId === option.id}
              onPress={() => {
                setClientId(option.id)
                setClientName(option.name)
              }}
            />
          ))}
        </View>

        {clientName.trim().length >= 2 && clientOptions.length === 0 ? (
          <Text style={styles.helperText}>검색된 내담자가 없습니다.</Text>
        ) : null}

        <Text style={styles.label}>상담사</Text>
        <View style={styles.chipRow}>
          {teacherOptions.map((option) => (
            <Chip
              key={option.username}
              label={option.name}
              selected={teacher === option.username}
              onPress={() => setTeacher(option.username)}
            />
          ))}
        </View>

        {!isOptionsLoading && teacherOptions.length === 0 ? (
          <Text style={styles.helperText}>선택 가능한 상담사가 없습니다.</Text>
        ) : null}

        <Text style={styles.label}>프로그램</Text>
        <View style={styles.chipRow}>
          {programOptions.map((option) => (
            <Chip
              key={option.id}
              label={option.name}
              selected={programId === option.id}
              onPress={() => setProgramId(option.id)}
            />
          ))}
        </View>

        {!isOptionsLoading && programOptions.length === 0 ? (
          <Text style={styles.helperText}>선택 가능한 프로그램이 없습니다.</Text>
        ) : null}

        <Text style={styles.label}>시작 시간</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeScroll}
          contentContainerStyle={styles.timeContent}
        >
          {timeOptions.map((option) => (
            <Chip key={`start-${option}`} label={option} selected={selectedStart === option} onPress={() => setSelectedStart(option)} />
          ))}
        </ScrollView>

        <Text style={styles.label}>종료 시간</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.timeScroll}
          contentContainerStyle={styles.timeContent}
        >
          {timeOptions.map((option) => (
            <Chip key={`end-${option}`} label={option} selected={selectedEnd === option} onPress={() => setSelectedEnd(option)} />
          ))}
        </ScrollView>

        <TextField label="메모" value={memo} onChangeText={setMemo} placeholder="특이사항" />

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <View style={styles.actions}>
          <Button
            title={isSubmitting ? '저장 중...' : '저장'}
            onPress={handleSubmit}
            disabled={isSubmitting || isOptionsLoading || isEditLoading}
          />

          {editMeta ? (
            <Button
              title={isSubmitting ? '처리 중...' : '일정 삭제'}
              onPress={handleDelete}
              variant="secondary"
              disabled={isSubmitting}
            />
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm
  },
  dateText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md
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
  timeScroll: {
    marginBottom: spacing.md
  },
  timeContent: {
    paddingRight: spacing.sm
  },
  errorText: {
    ...typography.body,
    color: colors.danger,
    marginBottom: spacing.md
  },
  actions: {
    marginTop: spacing.xl,
    gap: spacing.sm
  }
})
