import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import { colors, spacing, typography } from '@/lib/theme'
import { ClientInfo, getClients } from '@/lib/api/clients'
import { toApiErrorMessage } from '@/lib/api/utils'

export default function ClientsScreen() {
  const router = useRouter()
  const [clients, setClients] = useState<ClientInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadClients = useCallback(async (isRefresh = false) => {
    if (!isRefresh) {
      setIsLoading(true)
    }

    try {
      const response = await getClients(1, 50)
      const items = response?.items ?? []
      setClients(items)
      setError('')
    } catch (loadError) {
      setClients([])
      setError(toApiErrorMessage(loadError, '내담자 목록을 불러오지 못했습니다.'))
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadClients(false)
  }, [loadClients])

  const renderEmpty = () => {
    if (isLoading) {
      return <Text style={styles.loading}>내담자 목록을 불러오는 중입니다...</Text>
    }

    if (error) {
      return (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="다시 시도" onPress={() => loadClients(false)} variant="secondary" />
        </Card>
      )
    }

    return <EmptyState title="등록된 내담자가 없습니다" description="새 내담자를 등록해보세요." />
  }

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.container}
        data={clients}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={() => (
          <SectionHeader title="내담자" subtitle="오늘도 따뜻하게 돌봐주세요." />
        )}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true)
              loadClients(true)
            }}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(tabs)/clients/${item.id}`)}>
            <Card style={styles.card}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.client_name?.slice(0, 1) || '?'}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.client_name}</Text>
                <Text style={styles.meta}>{item.birth_date || '생년 미등록'}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.md
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  avatarText: {
    ...typography.subtitle,
    color: colors.primary
  },
  info: {
    flex: 1
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
  chevron: {
    color: colors.textSecondary,
    fontSize: 22
  }
})
