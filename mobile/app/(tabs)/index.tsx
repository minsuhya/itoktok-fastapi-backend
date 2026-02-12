import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useRouter } from 'expo-router'
import { Swipeable } from 'react-native-gesture-handler'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { colors, spacing, typography } from '@/lib/theme'
import { useAuth } from '@/lib/auth'
import { getDailySchedule, ScheduleEvent } from '@/lib/api/schedules'
import { toApiErrorMessage } from '@/lib/api/utils'

export default function HomeScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedDate] = useState(new Date())
  const [events, setEvents] = useState<ScheduleEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set())
  const [snackbar, setSnackbar] = useState<{ id: number; label: string } | null>(null)
  const snackbarTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dateLabel = useMemo(() => format(selectedDate, 'M월 d일 EEEE', { locale: ko }), [selectedDate])
  const totalCount = useMemo(() => events.length, [events])
  const completedCount = useMemo(
    () => events.filter((event) => String(event.schedule_status) === '2').length,
    [events]
  )
  const pendingCount = useMemo(
    () => events.filter((event) => String(event.schedule_status) === '5').length,
    [events]
  )

  const getStatusStyle = (status?: string | number) => {
    const normalized = String(status ?? '1')
    if (normalized === '2') {
      return { opacity: 0.6 }
    }
    if (normalized === '3') {
      return { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background }
    }
    if (normalized === '4') {
      return { borderWidth: 1, borderColor: colors.danger }
    }
    if (normalized === '5') {
      return { backgroundColor: colors.accentSoft }
    }
    return {}
  }

  const loadSchedule = useCallback(async (isRefresh = false) => {
    const targetDate = selectedDate
    if (!isRefresh) {
      setIsLoading(true)
    }
    try {
      const data = await getDailySchedule(targetDate)
      setEvents(data)
      setDismissedIds(new Set())
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

  const visibleEvents = useMemo(
    () => events.filter((event) => !dismissedIds.has(event.id)),
    [events, dismissedIds]
  )

  const showSnackbar = (event: ScheduleEvent) => {
    if (snackbarTimer.current) {
      clearTimeout(snackbarTimer.current)
    }
    setSnackbar({ id: event.id, label: `${event.client_name || '내담자'} 일정 숨김` })
    snackbarTimer.current = setTimeout(() => {
      setSnackbar(null)
    }, 3500)
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
        <SectionHeader
          title={`안녕하세요, ${user?.full_name || user?.username || '선생님'}님`}
          subtitle="오늘의 상담 일정을 정리해드릴게요."
        />

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>오늘 요약</Text>
          <Text style={styles.summarySubtitle}>{dateLabel}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.metric}>
              <View style={[styles.metricPill, styles.metricPillPrimary]}>
                <Text style={[styles.metricValue, styles.metricValuePrimary]}>{totalCount}</Text>
              </View>
              <Text style={styles.metricLabel}>전체</Text>
            </View>
            <View style={styles.metric}>
              <View style={[styles.metricPill, styles.metricPillAccent]}>
                <Text style={[styles.metricValue, styles.metricValueAccent]}>{pendingCount}</Text>
              </View>
              <Text style={styles.metricLabel}>보류</Text>
            </View>
            <View style={styles.metric}>
              <View style={[styles.metricPill, styles.metricPillNeutral]}>
                <Text style={[styles.metricValue, styles.metricValueNeutral]}>{completedCount}</Text>
              </View>
              <Text style={styles.metricLabel}>완료</Text>
            </View>
          </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>오늘 일정</Text>
          {isLoading ? (
            <Text style={styles.loading}>일정을 불러오는 중입니다...</Text>
          ) : loadError ? (
            <Card style={styles.errorCard}>
              <Text style={styles.errorText}>{loadError}</Text>
              <Button title="다시 시도" onPress={() => loadSchedule(false)} variant="secondary" />
            </Card>
          ) : visibleEvents.length === 0 ? (
            <EmptyState title="오늘 일정이 없습니다" description="잠시 숨을 고르고 새로운 일정을 추가해보세요." />
          ) : (
            visibleEvents.map((event) => (
              <Swipeable
                key={event.id}
                renderLeftActions={() => (
                  <View style={styles.swipeActionLeft}>
                    <Text style={styles.swipeText}>메모</Text>
                  </View>
                )}
                renderRightActions={() => (
                  <View style={styles.swipeActionRight}>
                    <Text style={styles.swipeText}>숨김</Text>
                  </View>
                )}
                onSwipeableOpen={(direction: 'left' | 'right') => {
                  if (direction === 'left') {
                    router.push({
                      pathname: '/(tabs)/schedule/memo',
                      params: { schedule_list_id: String(event.id) }
                    })
                    return
                  }
                  setDismissedIds((prev) => {
                    const next = new Set(prev)
                    next.add(event.id)
                    return next
                  })
                  showSnackbar(event)
                }}
              >
                <TouchableOpacity
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
                  <View style={styles.timelineRow}>
                    <Text style={styles.timelineTime}>{event.schedule_time}</Text>
                    <View style={[styles.timelineCard, getStatusStyle(event.schedule_status)]}>
                      <View style={[styles.statusStripe, { backgroundColor: event.teacher_usercolor || colors.primary }]} />
                      <View style={styles.timelineContent}>
                        <Text style={styles.timelineTitle}>{event.client_name || '내담자'}</Text>
                        <View style={styles.programRow}>
                          <Text style={styles.programPill}>{event.program_name || '프로그램'}</Text>
                          <Text style={styles.timelineSubtitle}>· {event.schedule_finish_time}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            ))
          )}
        </View>
      </ScrollView>
      {snackbar ? (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarText}>{snackbar.label}</Text>
          <TouchableOpacity
            onPress={() => {
              setDismissedIds((prev) => {
                const next = new Set(prev)
                next.delete(snackbar.id)
                return next
              })
              setSnackbar(null)
            }}
          >
            <Text style={styles.snackbarAction}>되돌리기</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg
  },
  summaryCard: {
    marginBottom: spacing.xl
  },
  summaryTitle: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  summarySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },
  summaryRow: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    justifyContent: 'space-between'
  },
  metric: {
    alignItems: 'center',
    flex: 1
  },
  metricPill: {
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 68,
    alignItems: 'center',
    marginBottom: spacing.sm
  },
  metricPillPrimary: {
    backgroundColor: colors.primarySoft
  },
  metricPillAccent: {
    backgroundColor: colors.accentSoft
  },
  metricPillNeutral: {
    backgroundColor: colors.border
  },
  metricValue: {
    ...typography.title
  },
  metricValuePrimary: {
    color: colors.primary
  },
  metricValueAccent: {
    color: colors.accent
  },
  metricValueNeutral: {
    color: colors.textSecondary
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary
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
    width: 54,
    alignSelf: 'flex-start',
    marginTop: spacing.xs
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.md,
    flex: 1,
    shadowColor: colors.primary,
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    flexDirection: 'row'
  },
  statusStripe: {
    width: 4,
    borderRadius: 6,
    marginRight: spacing.md
  },
  timelineContent: {
    flex: 1
  },
  timelineTitle: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  programRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs
  },
  programPill: {
    ...typography.caption,
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden'
  },
  timelineSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.xs
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
    backgroundColor: colors.accent,
    borderRadius: 18,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md
  },
  swipeActionRight: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md
  },
  swipeText: {
    color: '#FFFFFF',
    ...typography.caption
  },
  snackbar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.textPrimary,
    borderRadius: 18,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  snackbarText: {
    ...typography.body,
    color: '#FFFFFF'
  },
  snackbarAction: {
    ...typography.subtitle,
    color: colors.accent
  }
})
