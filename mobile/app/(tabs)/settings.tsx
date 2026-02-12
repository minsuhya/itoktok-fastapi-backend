import { StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { colors, spacing, typography } from '@/lib/theme'
import { useAuth } from '@/lib/auth'

export default function SettingsScreen() {
  const router = useRouter()
  const { user, signOut } = useAuth()

  return (
    <Screen>
      <View style={styles.container}>
        <SectionHeader title="설정" subtitle="계정과 알림 설정을 관리합니다." />
        <Card style={styles.card}>
          <Text style={styles.name}>{user?.full_name || user?.username || '사용자'}</Text>
          <Text style={styles.meta}>센터: {user?.center_username || '-'}</Text>
          <Text style={styles.meta}>권한: {user?.is_superuser ? '최고관리자' : user?.user_type === '1' ? '센터장' : '상담사'}</Text>
        </Card>
        <View style={styles.actions}>
          <Button title="내 정보 수정" onPress={() => router.push('/(tabs)/my-info')} />
          <Button title="센터 정보 수정" onPress={() => router.push('/(tabs)/center-info')} variant="secondary" />
          <Button title="프로그램 관리" onPress={() => router.push('/(tabs)/programs')} variant="secondary" />
          <Button title="상담사 관리" onPress={() => router.push('/(tabs)/users')} variant="secondary" />
        </View>
        <Button title="로그아웃" onPress={signOut} variant="secondary" />
      </View>
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
  actions: {
    gap: spacing.sm,
    marginBottom: spacing.xl
  },
  name: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  meta: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs
  }
})
