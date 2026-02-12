import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { PanResponder, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useRouter } from 'expo-router'
import { Calendar } from 'react-native-calendars'
import { Swipeable } from 'react-native-gesture-handler'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { colors, spacing, typography } from '@/lib/theme'
import { getDailySchedule, ScheduleEvent } from '@/lib/api/schedules'
import { toApiErrorMessage } from '@/lib/api/utils'

export default function ScheduleScreen() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadError, setLoadError] = useState('')

  const dateLabel = useMemo(() => format(selectedDate, 'M월 d일 EEEE', { locale: ko }), [selectedDate])
  const selectedDateKey = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate])
  const pendingCount = useMemo(
    () => events.filter((event) => String(event.schedule_status) !== '2').length,
    [events]
  )

  const markedDates = useMemo(() => ({
    [selectedDateKey]: {
      selected: true,
      selectedColor: colors.primary,
      selectedTextColor: '#FFFFFF'
    }
  }), [selectedDateKey])

  const loadSchedule = useCallback(async (isRefresh = false) => {
    if (!isRefresh) {
      setIsLoading(true)
    }
    try {
      const data = await getDailySchedule(selectedDate)
      setEvents(data)
      setLoadError('')
    } catch (error) {
      setEvents([])
      setLoadError(toApiErrorMessage(error, '일정을 불러오지 못했습니다.'))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [selectedDate])

  useEffect(() => {
    loadSchedule(false)
  }, [loadSchedule])

  const panResponder = useMemo(() =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 18,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 60) {
          setSelectedDate((prev) => {
            const next = new Date(prev)
            next.setDate(prev.getDate() - 1)
            return next
          })
        }
        if (gesture.dx < -60) {
          setSelectedDate((prev) => {
            const next = new Date(prev)
            next.setDate(prev.getDate() + 1)
            return next
          })
        }
      }
    }),
  []
  )

  const handleSwipeAction = (action: 'memo' | 'edit', event: ScheduleEvent) => {
    if (action === 'memo') {
      router.push({
        pathname: '/(tabs)/schedule/memo',
        params: { schedule_list_id: String(event.id) }
      })
      return
    }
    router.push({
      pathname: '/(tabs)/schedule/form',
      params: {
        schedule_list_id: String(event.id),
        schedule_id: String(event.schedule_id)
      }
    })
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
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
        <SectionHeader title="일정" subtitle={dateLabel} />

        <Card style={styles.calendarCard}>
          <Calendar
            markedDates={markedDates}
            onDayPress={(day) => {
              const [year, month, date] = day.dateString.split('-').map(Number)
              const next = new Date(year, month - 1, date)
              setSelectedDate(next)
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

        <Card style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>오늘 일정 요약</Text>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/(tabs)/schedule/form', params: { date: selectedDateKey } })}
            >
              <Text style={styles.cardAction}>새 일정</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.cardSubtitle}>완료되지 않은 상담 {pendingCount}건</Text>
        </Card>

        <View style={styles.section} {...panResponder.panHandlers}>
          <Text style={styles.sectionTitle}>타임라인</Text>
          {isLoading ? (
            <Text style={styles.loading}>일정을 불러오는 중입니다...</Text>
          ) : loadError ? (
            <Card style={styles.errorCard}>
              <Text style={styles.errorText}>{loadError}</Text>
              <Button title="다시 시도" onPress={() => loadSchedule(false)} variant="secondary" />
            </Card>
          ) : events.length === 0 ? (
            <EmptyState title="오늘 일정이 없습니다" description="새로운 일정을 추가해보세요." />
          ) : (
            events.map((event) => (
              <Swipeable
                key={event.id}
                renderLeftActions={() => (
                  <View style={styles.swipeActionLeft}>
                    <Text style={styles.swipeText}>메모</Text>
                  </View>
                )}
                renderRightActions={() => (
                  <View style={styles.swipeActionRight}>
                    <Text style={styles.swipeText}>수정</Text>
                  </View>
                )}
                onSwipeableOpen={(direction: 'left' | 'right') => {
                  handleSwipeAction(direction === 'left' ? 'memo' : 'edit', event)
                }}
              >
                <View style={styles.timelineRow}>
                  <Text style={styles.timelineTime}>{event.schedule_time}</Text>
                  <View style={styles.timelineCard}>
                    <View style={styles.statusStripe} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineTitle}>{event.client_name || '내담자'}</Text>
                      <Text style={styles.timelineSubtitle}>{event.program_name || '프로그램'} · {event.schedule_finish_time}</Text>
                    </View>
                  </View>
                </View>
              </Swipeable>
            ))
          )}
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
    marginBottom: spacing.xl
  },
  calendarCard: {
    padding: spacing.md,
    marginBottom: spacing.xl
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  cardAction: {
    ...typography.caption,
    color: colors.accent
  },
  cardSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },
  section: {
    marginBottom: spacing.xl
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.md
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  timelineTime: {
    ...typography.caption,
    color: colors.textSecondary,
    width: 54
  },
  timelineCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    flexDirection: 'row',
    padding: spacing.md,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 }
  },
  statusStripe: {
    width: 6,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginRight: spacing.md
  },
  timelineContent: {
    flex: 1
  },
  timelineTitle: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  timelineSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },
  loading: {
    ...typography.body,
    color: colors.textSecondary
  },
  errorCard: {
    gap: spacing.md,
    marginBottom: spacing.md
  },
  errorText: {
    ...typography.body,
    color: colors.danger
  },
  swipeActionLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md
  },
  swipeActionRight: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md
  },
  swipeText: {
    color: '#FFFFFF',
    ...typography.caption
  }
})
