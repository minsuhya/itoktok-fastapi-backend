import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useLocalSearchParams, useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'
import TeacherFilterChips from '@/components/ui/TeacherFilterChips'
import Button from '@/components/ui/Button'
import { colors, spacing, typography } from '@/lib/theme'
import { getWeeklySchedule, updateScheduleDateTime } from '@/lib/api/schedules'
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

function toDateKey(value: Date) {
  return format(value, 'yyyy-MM-dd')
}

function getWeekStart(value: Date) {
  const date = new Date(value)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

export default function WeeklyScheduleScreen() {
  const router = useRouter()
  const { date } = useLocalSearchParams<{ date?: string }>()

  const [anchorDate, setAnchorDate] = useState(parseRouteDate(date))
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

  const weekStart = useMemo(() => getWeekStart(anchorDate), [anchorDate])
  const weekDates = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const next = new Date(weekStart)
      next.setDate(weekStart.getDate() + index)
      return next
    })
  }, [weekStart])

  const title = useMemo(() => {
    const start = format(weekDates[0], 'M월 d일', { locale: ko })
    const end = format(weekDates[6], 'M월 d일', { locale: ko })
    return `${start} - ${end}`
  }, [weekDates])

  const loadSchedule = useCallback(
    async (isRefresh = false) => {
      if (!isRefresh) {
        setIsLoading(true)
      }
      try {
        const data = await getWeeklySchedule(
          anchorDate,
          selectedTeachers.length > 0 ? selectedTeachers : undefined
        )
        setEventsByDate(data)
        setLoadError('')
      } catch (error) {
        setEventsByDate({})
        setLoadError(toApiErrorMessage(error, '주간 일정을 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [anchorDate, selectedTeachers]
  )

  useEffect(() => {
    loadSchedule(false)
  }, [loadSchedule])

  const moveWeek = (offset: number) => {
    setAnchorDate((prev) => {
      const next = new Date(prev)
      next.setDate(prev.getDate() + offset * 7)
      return next
    })
  }

  const moveEventWithDateTime = async (params: {
    event: ScheduleEvent
    newDate: string
    newHour: number
    updateAllFuture: boolean
  }) => {
    setMovingEventId(params.event.id)
    setLoadError('')
    try {
      await updateScheduleDateTime({
        scheduleId: params.event.schedule_id,
        scheduleListId: params.event.id,
        newDate: params.newDate,
        newHour: params.newHour,
        updateAllFuture: params.updateAllFuture
      })
      await loadSchedule(false)
    } catch (error) {
      setLoadError(toApiErrorMessage(error, '일정 이동에 실패했습니다.'))
    } finally {
      setMovingEventId(null)
    }
  }

  const confirmMoveRange = (event: ScheduleEvent, newDate: string, newHour: number, targetLabel: string) => {
    Alert.alert('일정 이동', `${targetLabel}으로 이동합니다. 적용 범위를 선택하세요.`, [
      {
        text: '이번 일정만',
        onPress: () => {
          void moveEventWithDateTime({ event, newDate, newHour, updateAllFuture: false })
        }
      },
      {
        text: '이후 일정 전체',
        onPress: () => {
          void moveEventWithDateTime({ event, newDate, newHour, updateAllFuture: true })
        }
      },
      {
        text: '취소',
        style: 'cancel'
      }
    ])
  }

  const handleMoveAction = (event: ScheduleEvent, action: 'prevDay' | 'nextDay' | 'prevHour' | 'nextHour') => {
    const [year, month, day] = event.schedule_date.split('-').map(Number)
    const baseDate = new Date(year, month - 1, day)
    const originalHour = Number(event.schedule_time.split(':')[0])
    const fallbackHour = Number.isNaN(originalHour) ? 10 : originalHour

    const targetDate = new Date(baseDate)
    let targetHour = fallbackHour
    let targetLabel = ''

    if (action === 'prevDay') {
      targetDate.setDate(targetDate.getDate() - 1)
      targetLabel = `${toDateKey(targetDate)} ${String(targetHour).padStart(2, '0')}:00`
    }

    if (action === 'nextDay') {
      targetDate.setDate(targetDate.getDate() + 1)
      targetLabel = `${toDateKey(targetDate)} ${String(targetHour).padStart(2, '0')}:00`
    }

    if (action === 'prevHour') {
      targetHour = Math.max(0, fallbackHour - 1)
      targetLabel = `${toDateKey(targetDate)} ${String(targetHour).padStart(2, '0')}:00`
    }

    if (action === 'nextHour') {
      targetHour = Math.min(23, fallbackHour + 1)
      targetLabel = `${toDateKey(targetDate)} ${String(targetHour).padStart(2, '0')}:00`
    }

    confirmMoveRange(event, toDateKey(targetDate), targetHour, targetLabel)
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
        <SectionHeader title="주간 일정" subtitle={title} />

        <View style={styles.modeRow}>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => router.push({ pathname: '/(tabs)/schedule', params: { date: toDateKey(anchorDate) } })}
          >
            <Text style={styles.modeText}>일간</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeButton, styles.modeButtonActive]}>
            <Text style={[styles.modeText, styles.modeTextActive]}>주간</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => router.push({ pathname: '/(tabs)/schedule/monthly', params: { date: toDateKey(anchorDate) } })}
          >
            <Text style={styles.modeText}>월간</Text>
          </TouchableOpacity>
        </View>

        <TeacherFilterChips
          teachers={teachers}
          selectedTeacherSet={selectedTeacherSet}
          onToggleTeacher={toggleTeacher}
          onSelectAll={selectAll}
        />
        {teacherFilterError ? <Text style={styles.filterError}>{teacherFilterError}</Text> : null}

        <View style={styles.weekNavRow}>
          <Button title="이전 주" onPress={() => moveWeek(-1)} variant="secondary" />
          <Button title="다음 주" onPress={() => moveWeek(1)} variant="secondary" />
        </View>

        {isLoading ? (
          <Text style={styles.loading}>일정을 불러오는 중입니다...</Text>
        ) : loadError ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{loadError}</Text>
            <Button title="다시 시도" onPress={() => loadSchedule(false)} variant="secondary" />
          </Card>
        ) : (
          weekDates.map((day) => {
            const dayKey = toDateKey(day)
            const dayEvents = eventsByDate[dayKey] || []

            return (
              <Card key={dayKey} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>{format(day, 'M월 d일 EEEE', { locale: ko })}</Text>
                  <TouchableOpacity
                    onPress={() => router.push({ pathname: '/(tabs)/schedule/form', params: { date: dayKey } })}
                  >
                    <Text style={styles.addText}>새 일정</Text>
                  </TouchableOpacity>
                </View>

                {dayEvents.length === 0 ? (
                  <EmptyState title="일정 없음" description="등록된 일정이 없습니다." />
                ) : (
                  dayEvents.map((event) => (
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
                            onPress={() => handleMoveAction(event, 'prevDay')}
                          >
                            <Text style={styles.moveActionText}>전날</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.moveActionButton}
                            disabled={movingEventId === event.id}
                            onPress={() => handleMoveAction(event, 'nextDay')}
                          >
                            <Text style={styles.moveActionText}>다음날</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.moveActionButton}
                            disabled={movingEventId === event.id}
                            onPress={() => handleMoveAction(event, 'prevHour')}
                          >
                            <Text style={styles.moveActionText}>-1시간</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.moveActionButton}
                            disabled={movingEventId === event.id}
                            onPress={() => handleMoveAction(event, 'nextHour')}
                          >
                            <Text style={styles.moveActionText}>+1시간</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </Card>
            )
          })
        )}
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
  weekNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  loading: {
    ...typography.body,
    color: colors.textSecondary
  },
  errorCard: {
    gap: spacing.md
  },
  errorText: {
    ...typography.body,
    color: colors.danger
  },
  dayCard: {
    marginBottom: spacing.md
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  dayTitle: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  addText: {
    ...typography.caption,
    color: colors.accent
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
    flexWrap: 'wrap',
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
