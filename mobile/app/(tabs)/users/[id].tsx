import { useCallback, useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useFocusEffect } from '@react-navigation/native'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { colors, spacing, typography } from '@/lib/theme'
import { deleteUser, getUser } from '@/lib/api/users'
import type { UserListItem } from '@/lib/api/users'
import { toApiErrorMessage } from '@/lib/api/utils'

function getRoleLabel(user?: UserListItem) {
  if (!user) {
    return '-'
  }
  if (user.is_superuser === 1) {
    return '최고관리자'
  }
  if (user.user_type === '1') {
    return '센터장'
  }
  return '상담사'
}

export default function UserDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [user, setUser] = useState<UserListItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const loadUser = useCallback(async () => {
    if (!id) {
      return
    }

    setIsLoading(true)
    try {
      const data = await getUser(Number(id))
      setUser(data)
      setError('')
    } catch (loadError) {
      setUser(null)
      setError(toApiErrorMessage(loadError, '상담사 정보를 불러오지 못했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  useFocusEffect(
    useCallback(() => {
      loadUser()
    }, [loadUser])
  )

  const handleDelete = () => {
    if (!user?.id || isDeleting) {
      return
    }

    Alert.alert('상담사 삭제', `${user.full_name || user.username} 계정을 삭제하시겠어요?`, [
      {
        text: '취소',
        style: 'cancel'
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true)
          setError('')
          try {
            await deleteUser(user.id)
            router.back()
          } catch (deleteError) {
            setError(toApiErrorMessage(deleteError, '상담사 삭제에 실패했습니다.'))
          } finally {
            setIsDeleting(false)
          }
        }
      }
    ])
  }

  if (isLoading) {
    return (
      <Screen>
        <View style={styles.container}>
          <SectionHeader title="상담사 상세" subtitle="상담사 정보를 확인하세요." />
          <Text style={styles.meta}>상담사 정보를 불러오는 중입니다...</Text>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <SectionHeader title="상담사 상세" subtitle="상담사 정보를 확인하세요." />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Card style={styles.card}>
          <Text style={styles.name}>{user?.full_name || user?.username || '상담사'}</Text>
          <Text style={styles.meta}>아이디: {user?.username || '-'}</Text>
          <Text style={styles.meta}>이메일: {user?.email || '-'}</Text>
          <Text style={styles.meta}>권한: {getRoleLabel(user || undefined)}</Text>
          <Text style={styles.meta}>휴대폰: {user?.hp_number || '-'}</Text>
          <Text style={styles.meta}>전화번호: {user?.phone_number || '-'}</Text>
          <Text style={styles.meta}>전문분야: {user?.expertise || '-'}</Text>
          <Text style={styles.meta}>센터: {user?.center_username || '-'}</Text>
        </Card>

        <View style={styles.actions}>
          <Button
            title="상담사 정보 수정"
            onPress={() => router.push({ pathname: '/(tabs)/users/form', params: { id: String(user?.id || '') } })}
          />
          <Button
            title={isDeleting ? '삭제 중...' : '상담사 삭제'}
            onPress={handleDelete}
            variant="secondary"
            disabled={isDeleting}
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
  card: {
    marginBottom: spacing.md
  },
  name: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm
  },
  meta: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs
  },
  errorText: {
    ...typography.body,
    color: colors.danger,
    marginBottom: spacing.md
  },
  actions: {
    gap: spacing.sm
  }
})
