import React, { useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { colors, spacing, typography } from '@/lib/theme'
import { useAuth } from '@/lib/auth'

export default function LoginScreen() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    try {
      await signIn(username.trim(), password)
      router.replace('/(tabs)')
    } catch (err) {
      setError('아이디 또는 비밀번호를 확인해주세요.')
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
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="로그인" onPress={handleLogin} />
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
  }
})
