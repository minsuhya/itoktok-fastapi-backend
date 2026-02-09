import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import { colors, spacing, typography } from '@/lib/theme'
import { getClient } from '@/lib/api/clients'

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [client, setClient] = useState<any>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      if (!id) return
      try {
        const data = await getClient(Number(id))
        if (isMounted) {
          setClient(data)
        }
      } catch (error) {
        if (isMounted) {
          setClient(null)
        }
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [id])

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
          <Text style={styles.cardItem}>상담 상태: {client?.consultant_status || '-'}</Text>
          <Text style={styles.cardItem}>주소: {client?.address_city || '-'}</Text>
        </Card>

        <Card style={styles.noteCard}>
          <Text style={styles.cardTitle}>메모</Text>
          <Text style={styles.cardItem}>{client?.memo || '등록된 메모가 없습니다.'}</Text>
        </Card>
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
  }
})
