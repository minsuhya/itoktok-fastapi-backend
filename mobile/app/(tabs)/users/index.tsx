import { useCallback, useEffect, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import TextField from '@/components/ui/TextField'
import { colors, spacing, typography } from '@/lib/theme'
import { getUsers } from '@/lib/api/users'
import type { UserListItem } from '@/lib/api/users'
import { toApiErrorMessage } from '@/lib/api/utils'

export default function UsersScreen() {
  const router = useRouter()
  const [users, setUsers] = useState<UserListItem[]>([])
  const [searchText, setSearchText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadUsers = useCallback(async (isRefresh = false, query = searchText) => {
    if (!isRefresh) {
      setIsLoading(true)
    }

    try {
      const response = await getUsers(1, 20, query)
      setUsers(response?.items || [])
      setError('')
    } catch (loadError) {
      setUsers([])
      setError(toApiErrorMessage(loadError, '상담사 목록을 불러오지 못했습니다.'))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [searchText])

  useEffect(() => {
    loadUsers(false)
  }, [loadUsers])

  useFocusEffect(
    useCallback(() => {
      loadUsers(false)
    }, [loadUsers])
  )

  const renderEmpty = () => {
    if (isLoading) {
      return <Text style={styles.loading}>상담사 목록을 불러오는 중입니다...</Text>
    }

    if (error) {
      return (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="다시 시도" onPress={() => loadUsers(false)} variant="secondary" />
        </Card>
      )
    }

    return <EmptyState title="등록된 상담사가 없습니다" description="상담사를 등록해보세요." />
  }

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.container}
        data={users}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={() => (
          <View style={styles.headerBlock}>
            <SectionHeader title="상담사" subtitle="센터 상담사를 관리하세요." />
            <TextField
              label="상담사 검색"
              value={searchText}
              onChangeText={setSearchText}
              placeholder="이름 검색"
            />
            <View style={styles.headerActions}>
              <Button title="검색" onPress={() => loadUsers(false, searchText)} variant="secondary" />
              <Button title="상담사 등록" onPress={() => router.push('/(tabs)/users/form')} />
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
              loadUsers(true)
            }}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(tabs)/users/${item.id}`)}>
            <Card style={styles.card}>
              <Text style={styles.name}>{item.full_name || item.username}</Text>
              <Text style={styles.meta}>아이디: {item.username}</Text>
              <Text style={styles.meta}>이메일: {item.email || '-'}</Text>
              <Text style={styles.meta}>휴대폰: {item.hp_number || '-'}</Text>
            </Card>
          </TouchableOpacity>
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
    marginBottom: spacing.md
  },
  name: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs
  }
})
