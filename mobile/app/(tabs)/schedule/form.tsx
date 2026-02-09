import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
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
import { createSchedule, getSchedule, normalizeRepeatDays, updateSchedule } from '@/lib/api/schedules'

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
  const [clientOptions, setClientOptions] = useState<{ id: number; name: string; phone?: string }[]>([])
  const [teacherOptions, setTeacherOptions] = useState<{ username: string; name: string }[]>([])
  const [programOptions, setProgramOptions] = useState<{ id: number; name: string }[]>([])
  const [selectedStart, setSelectedStart] = useState('10:00')
  const [selectedEnd, setSelectedEnd] = useState('10:50')
  const [editMeta, setEditMeta] = useState<{ scheduleListId?: number; scheduleId?: number } | null>(null)
  const [editDetail, setEditDetail] = useState<any>(null)

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
      try {
        const [teachersResponse, programsResponse] = await Promise.all([getTeachers(), getPrograms()])
        setTeacherOptions((teachersResponse || []).map((item: any) => ({
          username: item.username,
          name: item.full_name
        })))
        setProgramOptions((programsResponse?.items || []).map((item: any) => ({
          id: item.id,
          name: item.program_name
        })))
      } catch (error) {
        setTeacherOptions([])
        setProgramOptions([])
      }
    }

    load()
  }, [])

  useEffect(() => {
    const loadEdit = async () => {
      if (!schedule_list_id || !schedule_id) return
      const detail = await getSchedule(Number(schedule_list_id))
      setClientName(detail?.clientinfo?.client_name || '')
      setClientId(detail?.client_id || null)
      setTeacher(detail?.teacher_username || '')
      setProgramId(detail?.program_id || null)
      setSelectedStart(detail?.schedule?.start_time || detail?.schedule_time || '10:00')
      setSelectedEnd(detail?.schedule?.finish_time || detail?.schedule_finish_time || '10:50')
      setMemo(detail?.schedule_memo || detail?.schedule?.memo || '')
      setEditMeta({ scheduleListId: detail?.id, scheduleId: detail?.schedule_id })
      setEditDetail(detail)
    }

    loadEdit()
  }, [schedule_list_id, schedule_id])

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
          setClientOptions(items.map((item: any) => ({
            id: item.id,
            name: item.client_name,
            phone: item.phone_number
          })))
        }
      } catch (error) {
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

  const selectedDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0]

  const handleSubmit = async () => {
    if (!clientId || !teacher || !programId) return

    if (editMeta?.scheduleId && editMeta?.scheduleListId) {
      const repeatDays = normalizeRepeatDays(editDetail?.schedule?.repeat_days)
      await updateSchedule(editMeta.scheduleId, editMeta.scheduleListId, {
        teacher_username: teacher,
        client_id: clientId,
        program_id: programId,
        schedule_type: editDetail?.schedule?.schedule_type || 1,
        start_date: editDetail?.schedule?.start_date || selectedDate,
        finish_date: editDetail?.schedule?.finish_date || selectedDate,
        start_time: selectedStart,
        finish_time: selectedEnd,
        repeat_type: editDetail?.schedule?.repeat_type || '2',
        repeat_days: repeatDays,
        schedule_status: '1',
        update_range: 'single',
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
  }

  return (
    <Screen backgroundColor={colors.surface}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <SectionHeader title={editMeta ? '일정 수정' : '일정 등록'} subtitle="새로운 상담 일정을 입력하세요." />
        <Text style={styles.dateText}>선택 날짜: {selectedDate}</Text>
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
        <Text style={styles.label}>시간</Text>
        <View style={styles.chipRow}>
          {timeOptions.slice(0, 6).map((option) => (
            <Chip key={option} label={option} selected={selectedStart === option} onPress={() => setSelectedStart(option)} />
          ))}
        </View>
        <View style={styles.chipRow}>
          {timeOptions.slice(6, 12).map((option) => (
            <Chip key={option} label={option} selected={selectedEnd === option} onPress={() => setSelectedEnd(option)} />
          ))}
        </View>
        <TextField label="메모" value={memo} onChangeText={setMemo} placeholder="특이사항" />
        <View style={styles.actions}>
          <Button title="저장" onPress={handleSubmit} />
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md
  },
  actions: {
    marginTop: spacing.xl
  }
})
