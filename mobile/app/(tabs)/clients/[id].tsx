import { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import { colors, spacing, typography } from '@/lib/theme'
import { getClient, updateClientConsultantStatus } from '@/lib/api/clients'
import type { ClientInfo } from '@/lib/api/clients'
import { toApiErrorMessage } from '@/lib/api/utils'

function getConsultantStatusLabel(status?: string) {
  if (status === '1') return '상담진행'
  if (status === '2') return '상담보류'
  if (status === '3') return '상담종결'
  return '-'
}

export default function ClientDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [client, setClient] = useState<ClientInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStatusUpdating, setIsStatusUpdating] = useState(false)
  const [error, setError] = useState('')

  const loadClient = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    try {
      const data = await getClient(Number(id))
      setClient(data)
      setError('')
    } catch (loadError) {
      setClient(null)
      setError(toApiErrorMessage(loadError, '내담자 정보를 불러오지 못했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadClient()
  }, [loadClient])

  useFocusEffect(
    useCallback(() => {
      loadClient()
    }, [loadClient])
  )

  const handleStatusUpdate = async (nextStatus: string) => {
    if (!client?.id || isStatusUpdating) return
    if (client.consultant_status === nextStatus) return

    setIsStatusUpdating(true)
    setError('')
    try {
      const updated = await updateClientConsultantStatus(client.id, nextStatus)
      setClient(updated)
    } catch (updateError) {
      setError(toApiErrorMessage(updateError, '상담 상태를 변경하지 못했습니다.'))
    } finally {
      setIsStatusUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.container}>
          <SectionHeader title="내담자 프로필" subtitle="최근 상담 기록을 확인하세요." />
          <Text style={styles.meta}>내담자 정보를 불러오는 중입니다...</Text>
        </View>
      </Screen>
    )
  }

  if (error) {
    return (
      <Screen>
        <View style={styles.container}>
          <SectionHeader title="내담자 프로필" subtitle="최근 상담 기록을 확인하세요." />
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
            <Button title="다시 시도" onPress={loadClient} variant="secondary" />
          </Card>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <SectionHeader title="내담자 프로필" subtitle="최근 상담 기록을 확인하세요." />
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{client?.client_name?.slice(0, 1) || '?'}</Text>
        </View>
        <Text style={styles.name}>{client?.client_name || '내담자'}</Text>
        <Text style={styles.meta}>{client?.birth_date || '생년 미등록'}</Text>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>기본 정보</Text>
          <Text style={styles.cardItem}>연락처: {client?.phone_number || '-'}</Text>
          <Text style={styles.cardItem}>상담 상태: {getConsultantStatusLabel(client?.consultant_status)}</Text>
          <Text style={styles.cardItem}>주소: {client?.address_city || '-'}</Text>

          <Text style={styles.statusLabel}>상담 상태 변경</Text>
          <View style={styles.statusChipRow}>
            <Chip
              label="상담진행"
              selected={client?.consultant_status === '1'}
              onPress={() => {
                void handleStatusUpdate('1')
              }}
            />
            <Chip
              label="상담보류"
              selected={client?.consultant_status === '2'}
              onPress={() => {
                void handleStatusUpdate('2')
              }}
            />
            <Chip
              label="상담종결"
              selected={client?.consultant_status === '3'}
              onPress={() => {
                void handleStatusUpdate('3')
              }}
            />
          </View>
          {isStatusUpdating ? <Text style={styles.updatingText}>상담 상태 저장 중...</Text> : null}
        </Card>

        <Card style={styles.noteCard}>
          <Text style={styles.cardTitle}>메모</Text>
          <Text style={styles.cardItem}>{client?.memo || '등록된 메모가 없습니다.'}</Text>
        </Card>

        <View style={styles.actionRow}>
          <Button
            title="내담자 정보 수정"
            onPress={() => router.push({ pathname: '/(tabs)/clients/form', params: { id: String(client?.id || '') } })}
          />
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md
  },
  avatarText: {
    ...typography.title,
    color: colors.primary
  },
  name: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.md
  },
  meta: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg
  },
  card: {
    marginBottom: spacing.md
  },
  errorCard: {
    gap: spacing.md
  },
  errorText: {
    ...typography.body,
    color: colors.danger
  },
  noteCard: {
    backgroundColor: colors.accentSoft
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm
  },
  cardItem: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs
  },
  statusLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs
  },
  statusChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs
  },
  updatingText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },
  actionRow: {
    marginTop: spacing.md
  }
})
