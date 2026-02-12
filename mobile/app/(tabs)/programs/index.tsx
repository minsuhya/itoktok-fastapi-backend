import { useCallback, useEffect, useState } from 'react'
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import TextField from '@/components/ui/TextField'
import { colors, spacing, typography } from '@/lib/theme'
import { deleteProgram, getPrograms } from '@/lib/api/programs'
import type { ProgramInfo } from '@/lib/api/programs'
import { toApiErrorMessage } from '@/lib/api/utils'

export default function ProgramsScreen() {
  const router = useRouter()
  const [programs, setPrograms] = useState<ProgramInfo[]>([])
  const [searchText, setSearchText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const loadPrograms = useCallback(async (isRefresh = false, query = searchText) => {
    if (!isRefresh) {
      setIsLoading(true)
    }

    try {
      const response = await getPrograms(1, 50, query)
      setPrograms(response?.items || [])
      setError('')
    } catch (loadError) {
      setPrograms([])
      setError(toApiErrorMessage(loadError, '프로그램 목록을 불러오지 못했습니다.'))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [searchText])

  useEffect(() => {
    loadPrograms(false)
  }, [loadPrograms])

  useFocusEffect(
    useCallback(() => {
      loadPrograms(false)
    }, [loadPrograms])
  )

  const confirmDelete = (program: ProgramInfo) => {
    if (!program.id || deletingId) {
      return
    }

    Alert.alert('프로그램 삭제', `${program.program_name} 프로그램을 삭제하시겠어요?`, [
      {
        text: '취소',
        style: 'cancel'
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          setDeletingId(program.id)
          setError('')
          try {
            await deleteProgram(program.id)
            await loadPrograms(false)
          } catch (deleteError) {
            setError(toApiErrorMessage(deleteError, '프로그램을 삭제하지 못했습니다.'))
          } finally {
            setDeletingId(null)
          }
        }
      }
    ])
  }

  const renderEmpty = () => {
    if (isLoading) {
      return <Text style={styles.loading}>프로그램 목록을 불러오는 중입니다...</Text>
    }

    if (error) {
      return (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="다시 시도" onPress={() => loadPrograms(false)} variant="secondary" />
        </Card>
      )
    }

    return <EmptyState title="등록된 프로그램이 없습니다" description="새 프로그램을 등록해보세요." />
  }

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.container}
        data={programs}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={() => (
          <View style={styles.headerBlock}>
            <SectionHeader title="프로그램" subtitle="센터 프로그램을 관리하세요." />
            <TextField
              label="프로그램 검색"
              value={searchText}
              onChangeText={setSearchText}
              placeholder="프로그램명 검색"
            />
            <View style={styles.headerActions}>
              <Button title="검색" onPress={() => loadPrograms(false, searchText)} variant="secondary" />
              <Button title="프로그램 등록" onPress={() => router.push('/(tabs)/programs/form')} />
            </View>
            {error ? <Text style={styles.inlineError}>{error}</Text> : null}
          </View>
        )}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true)
              loadPrograms(true)
            }}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/(tabs)/programs/form', params: { id: String(item.id) } })}
            >
              <Text style={styles.name}>{item.program_name || '프로그램'}</Text>
              <Text style={styles.meta}>유형: {item.program_type || '-'}</Text>
              <Text style={styles.meta}>
                담당: {item.is_all_teachers ? '전체 선생님' : item.teacher?.full_name || item.teacher_username || '-'}
              </Text>
            </TouchableOpacity>
            <View style={styles.cardActions}>
              <Button
                title={deletingId === item.id ? '삭제 중...' : '삭제'}
                onPress={() => confirmDelete(item)}
                variant="secondary"
                disabled={deletingId === item.id}
              />
            </View>
          </Card>
        )}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg
  },
  headerBlock: {
    marginBottom: spacing.md
  },
  headerActions: {
    gap: spacing.sm,
    marginBottom: spacing.sm
  },
  inlineError: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.sm
  },
  loading: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.lg
  },
  errorCard: {
    marginTop: spacing.md,
    gap: spacing.md
  },
  errorText: {
    ...typography.body,
    color: colors.danger
  },
  card: {
    marginBottom: spacing.md,
    gap: spacing.md
  },
  name: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },
  cardActions: {
    marginTop: spacing.sm
  }
})
