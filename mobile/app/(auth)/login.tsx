import { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { colors, spacing, typography } from '@/lib/theme'
import { useAuth } from '@/lib/auth'
import { toApiErrorMessage } from '@/lib/api/utils'

export default function LoginScreen() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async () => {
    if (isSubmitting) return

    if (!username.trim() || !password) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      await signIn(username.trim(), password)
      router.replace('/(tabs)')
    } catch (err) {
      setError(toApiErrorMessage(err, '아이디 또는 비밀번호를 확인해주세요.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.blob} />
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=600&auto=format&fit=crop' }}
          style={styles.heroImage}
        />
        <Text style={styles.heroTitle}>ITokTok</Text>
        <Text style={styles.heroSubtitle}>따뜻하고 단단한 상담 운영</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>로그인</Text>
        <Text style={styles.cardSubtitle}>오늘의 일정과 내담자를 한눈에 확인하세요.</Text>
        <TextField label="아이디" value={username} onChangeText={setUsername} placeholder="아이디" />
        <TextField
          label="비밀번호"
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호"
          secureTextEntry
        />
        <View style={styles.passwordHelpRow}>
          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
            <Text style={styles.link}>비밀번호를 잊어버렸나요?</Text>
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title={isSubmitting ? '로그인 중...' : '로그인'} onPress={handleLogin} disabled={isSubmitting} />
        <View style={styles.signupRow}>
          <Text style={styles.signupLabel}>회원이 아니신가요?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.link}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl
  },
  blob: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    backgroundColor: colors.primarySoft,
    borderRadius: 999
  },
  heroImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: spacing.md
  },
  heroTitle: {
    ...typography.title,
    color: colors.textPrimary
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },
  card: {
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: spacing.xl,
    flex: 1
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  cardSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.md,
    ...typography.caption
  },
  passwordHelpRow: {
    alignItems: 'flex-end',
    marginBottom: spacing.md
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs
  },
  signupLabel: {
    ...typography.caption,
    color: colors.textSecondary
  },
  link: {
    ...typography.caption,
    color: colors.primary
  }
})
