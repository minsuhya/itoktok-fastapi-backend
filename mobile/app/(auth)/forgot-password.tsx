import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { colors, spacing, typography } from '@/lib/theme'
import { forgotPassword } from '@/lib/api/users'
import { toApiErrorMessage } from '@/lib/api/utils'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (isSubmitting) {
      return
    }

    if (!email.includes('@')) {
      setError('올바른 이메일을 입력해주세요.')
      return
    }

    setError('')
    setSuccess('')
    setIsSubmitting(true)
    try {
      await forgotPassword({ email: email.trim() })
      setSuccess('비밀번호 재설정 요청을 접수했습니다.')
    } catch (submitError) {
      setError(toApiErrorMessage(submitError, '비밀번호 재설정 요청에 실패했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.title}>비밀번호 찾기</Text>
        <Text style={styles.subtitle}>가입한 이메일로 재설정 요청을 보냅니다.</Text>

        <TextField label="이메일" value={email} onChangeText={setEmail} placeholder="you@example.com" />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        <Button
          title={isSubmitting ? '요청 중...' : '재설정 요청'}
          onPress={handleSubmit}
          disabled={isSubmitting}
        />

        <View style={styles.linkRow}>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.link}>로그인으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    flex: 1
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.md,
    ...typography.caption
  },
  success: {
    color: colors.primary,
    marginBottom: spacing.md,
    ...typography.caption
  },
  linkRow: {
    alignItems: 'center',
    marginTop: spacing.lg
  },
  link: {
    ...typography.caption,
    color: colors.primary
  }
})
