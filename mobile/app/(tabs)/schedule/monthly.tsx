import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar } from 'react-native-calendars'
import { useLocalSearchParams, useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import TeacherFilterChips from '@/components/ui/TeacherFilterChips'
import { colors, spacing, typography } from '@/lib/theme'
import { getMonthlySchedule, updateScheduleDate } from '@/lib/api/schedules'
import type { ScheduleEvent } from '@/lib/api/schedules'
import { toApiErrorMessage } from '@/lib/api/utils'
import { useTeacherFilters } from '@/lib/useTeacherFilters'

function parseRouteDate(value?: string) {
  if (!value) {
    return new Date()
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

function toDateKey(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

function toMonthStart(date: Date) {
  const next = new Date(date)
  next.setDate(1)
  next.setHours(0, 0, 0, 0)
  return next
}

export default function MonthlyScheduleScreen() {
  const router = useRouter()
  const { date } = useLocalSearchParams<{ date?: string }>()

  const [anchorMonth, setAnchorMonth] = useState(toMonthStart(parseRouteDate(date)))
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(parseRouteDate(date)))
  const [eventsByDate, setEventsByDate] = useState<Record<string, ScheduleEvent[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [movingEventId, setMovingEventId] = useState<number | null>(null)
  const [loadError, setLoadError] = useState('')
  const {
    teachers,
    selectedTeachers,
    selectedTeacherSet,
    error: teacherFilterError,
    toggleTeacher,
    selectAll
  } = useTeacherFilters()

  const title = useMemo(() => format(anchorMonth, 'yyyy년 M월', { locale: ko }), [anchorMonth])

  const loadSchedule = useCallback(
    async (isRefresh = false) => {
      if (!isRefresh) {
        setIsLoading(true)
      }

      try {
        const data = await getMonthlySchedule(
          anchorMonth,
          selectedTeachers.length > 0 ? selectedTeachers : undefined
        )
        setEventsByDate(data)
        setLoadError('')
      } catch (error) {
        setEventsByDate({})
        setLoadError(toApiErrorMessage(error, '월간 일정을 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [anchorMonth, selectedTeachers]
  )

  useEffect(() => {
    loadSchedule(false)
  }, [loadSchedule])

  const markedDates = useMemo(() => {
    const marks: Record<string, { selected?: boolean; selectedColor?: string; selectedTextColor?: string; marked?: boolean; dotColor?: string }> = {}

    Object.keys(eventsByDate).forEach((dateKey) => {
      if ((eventsByDate[dateKey] || []).length > 0) {
        marks[dateKey] = {
          ...(marks[dateKey] || {}),
          marked: true,
          dotColor: colors.accent
        }
      }
    })

    marks[selectedDateKey] = {
      ...(marks[selectedDateKey] || {}),
      selected: true,
      selectedColor: colors.primary,
      selectedTextColor: '#FFFFFF'
    }

    return marks
  }, [eventsByDate, selectedDateKey])

  const selectedEvents = useMemo(() => eventsByDate[selectedDateKey] || [], [eventsByDate, selectedDateKey])

  const moveMonth = (offset: number) => {
    setAnchorMonth((prev) => {
      const next = new Date(prev)
      next.setMonth(prev.getMonth() + offset)
      return toMonthStart(next)
    })
  }

  const moveEventDate = async (params: {
    event: ScheduleEvent
    newDate: string
    updateAllFuture: boolean
  }) => {
    setMovingEventId(params.event.id)
    setLoadError('')
    try {
      await updateScheduleDate({
        scheduleId: params.event.schedule_id,
        scheduleListId: params.event.id,
        newDate: params.newDate,
        updateAllFuture: params.updateAllFuture
      })
      await loadSchedule(false)
    } catch (error) {
      setLoadError(toApiErrorMessage(error, '일정 이동에 실패했습니다.'))
    } finally {
      setMovingEventId(null)
    }
  }

  const confirmDateMove = (event: ScheduleEvent, dayOffset: number) => {
    const [year, month, day] = event.schedule_date.split('-').map(Number)
    const targetDate = new Date(year, month - 1, day)
    targetDate.setDate(targetDate.getDate() + dayOffset)
    const newDate = toDateKey(targetDate)

    Alert.alert('일정 이동', `${newDate}로 이동합니다. 적용 범위를 선택하세요.`, [
      {
        text: '이번 일정만',
        onPress: () => {
          void moveEventDate({ event, newDate, updateAllFuture: false })
        }
      },
      {
        text: '이후 일정 전체',
        onPress: () => {
          void moveEventDate({ event, newDate, updateAllFuture: true })
        }
      },
      {
        text: '취소',
        style: 'cancel'
      }
    ])
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true)
              loadSchedule(true)
            }}
            tintColor={colors.primary}
          />
        }
      >
        <SectionHeader title="월간 일정" subtitle={title} />

        <View style={styles.modeRow}>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => router.push({ pathname: '/(tabs)/schedule', params: { date: selectedDateKey } })}
          >
            <Text style={styles.modeText}>일간</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => router.push({ pathname: '/(tabs)/schedule/weekly', params: { date: selectedDateKey } })}
          >
            <Text style={styles.modeText}>주간</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeButton, styles.modeButtonActive]}>
            <Text style={[styles.modeText, styles.modeTextActive]}>월간</Text>
          </TouchableOpacity>
        </View>

        <TeacherFilterChips
          teachers={teachers}
          selectedTeacherSet={selectedTeacherSet}
          onToggleTeacher={toggleTeacher}
          onSelectAll={selectAll}
        />
        {teacherFilterError ? <Text style={styles.filterError}>{teacherFilterError}</Text> : null}

        <View style={styles.monthNavRow}>
          <Button title="이전 달" onPress={() => moveMonth(-1)} variant="secondary" />
          <Button title="다음 달" onPress={() => moveMonth(1)} variant="secondary" />
        </View>

        <Card style={styles.calendarCard}>
          <Calendar
            current={toDateKey(anchorMonth)}
            markedDates={markedDates}
            onMonthChange={(month) => {
              const next = new Date(month.year, month.month - 1, 1)
              setAnchorMonth(toMonthStart(next))
            }}
            onDayPress={(day) => {
              setSelectedDateKey(day.dateString)
            }}
            theme={{
              backgroundColor: colors.surface,
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: '#FFFFFF',
              todayTextColor: colors.accent,
              dayTextColor: colors.textPrimary,
              textDisabledColor: colors.border,
              arrowColor: colors.primary,
              monthTextColor: colors.textPrimary,
              textDayFontFamily: typography.body.fontFamily,
              textMonthFontFamily: typography.subtitle.fontFamily,
              textDayHeaderFontFamily: typography.caption.fontFamily
            }}
          />
        </Card>

        <Card style={styles.listCard}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{selectedDateKey} 일정</Text>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/(tabs)/schedule/form', params: { date: selectedDateKey } })}
            >
              <Text style={styles.addText}>새 일정</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <Text style={styles.loading}>일정을 불러오는 중입니다...</Text>
          ) : loadError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{loadError}</Text>
              <Button title="다시 시도" onPress={() => loadSchedule(false)} variant="secondary" />
            </View>
          ) : selectedEvents.length === 0 ? (
            <EmptyState title="일정 없음" description="등록된 일정이 없습니다." />
          ) : (
            selectedEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventRow}
                onPress={() =>
                  router.push({
                    pathname: '/(tabs)/schedule/form',
                    params: {
                      schedule_list_id: String(event.id),
                      schedule_id: String(event.schedule_id)
                    }
                  })
                }
              >
                <Text style={styles.eventTime}>{event.schedule_time}</Text>
                <View style={styles.eventMeta}>
                  <Text style={styles.eventName}>{event.client_name || '내담자'}</Text>
                  <Text style={styles.eventSub}>{event.program_name || '프로그램'}</Text>
                  <View style={styles.moveActionRow}>
                    <TouchableOpacity
                      style={styles.moveActionButton}
                      disabled={movingEventId === event.id}
                      onPress={() => confirmDateMove(event, -1)}
                    >
                      <Text style={styles.moveActionText}>전날</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.moveActionButton}
                      disabled={movingEventId === event.id}
                      onPress={() => confirmDateMove(event, 1)}
                    >
                      <Text style={styles.moveActionText}>다음날</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </Card>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg
  },
  modeRow: {
    flexDirection: 'row',
    marginBottom: spacing.md
  },
  modeButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm
  },
  modeButtonActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary
  },
  modeText: {
    ...typography.caption,
    color: colors.textSecondary
  },
  modeTextActive: {
    color: colors.primary
  },
  filterError: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.sm
  },
  monthNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  calendarCard: {
    padding: spacing.md,
    marginBottom: spacing.md
  },
  listCard: {
    marginBottom: spacing.lg
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  listTitle: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  addText: {
    ...typography.caption,
    color: colors.accent
  },
  loading: {
    ...typography.body,
    color: colors.textSecondary
  },
  errorBox: {
    gap: spacing.md
  },
  errorText: {
    ...typography.body,
    color: colors.danger
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border
  },
  eventTime: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 60
  },
  eventMeta: {
    flex: 1
  },
  eventName: {
    ...typography.body,
    color: colors.textPrimary
  },
  eventSub: {
    ...typography.caption,
    color: colors.textSecondary
  },
  moveActionRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
    gap: spacing.xs
  },
  moveActionButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface
  },
  moveActionText: {
    ...typography.caption,
    color: colors.textSecondary
  }
})
