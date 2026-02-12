import { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { colors, spacing, typography } from '@/lib/theme'
import { checkUsername, signup } from '@/lib/api/users'
import { toApiErrorMessage } from '@/lib/api/utils'

export default function SignupScreen() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [hpNumber, setHpNumber] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [address, setAddress] = useState('')
  const [addressExtra, setAddressExtra] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignup = async () => {
    if (isSubmitting) {
      return
    }

    if (!username.trim() || username.trim().length < 4) {
      setError('아이디는 4자 이상 입력해주세요.')
      return
    }

    if (!password || password.length < 8) {
      setError('비밀번호는 8자 이상 입력해주세요.')
      return
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (!email.includes('@')) {
      setError('올바른 이메일을 입력해주세요.')
      return
    }

    if (!fullName.trim()) {
      setError('이름을 입력해주세요.')
      return
    }

    if (!hpNumber.trim()) {
      setError('휴대폰번호를 입력해주세요.')
      return
    }

    setError('')
    setIsSubmitting(true)
    try {
      const usernameCheck = await checkUsername(username.trim())
      if (usernameCheck.exists) {
        setError('이미 등록된 아이디입니다.')
        setIsSubmitting(false)
        return
      }

      await signup({
        username: username.trim(),
        password,
        email: email.trim(),
        full_name: fullName.trim(),
        birth_date: birthDate.trim(),
        zip_code: '',
        address: address.trim(),
        address_extra: addressExtra.trim(),
        phone_number: phoneNumber.trim(),
        hp_number: hpNumber.trim(),
        user_type: '1',
        center_username: username.trim(),
        is_active: 1,
        is_superuser: 0,
        usercolor: '#5D8B78',
        expertise: ''
      })

      router.replace('/(auth)/login')
    } catch (signupError) {
      setError(toApiErrorMessage(signupError, '회원가입에 실패했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>회원가입</Text>
        <Text style={styles.subtitle}>센터 계정을 생성하세요.</Text>

        <TextField label="아이디" value={username} onChangeText={setUsername} placeholder="아이디" />
        <TextField
          label="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="8자 이상"
        />
        <TextField
          label="비밀번호 확인"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          secureTextEntry
          placeholder="비밀번호 확인"
        />
        <TextField label="이메일" value={email} onChangeText={setEmail} placeholder="you@example.com" />
        <TextField label="이름" value={fullName} onChangeText={setFullName} placeholder="홍길동" />
        <TextField label="휴대폰번호" value={hpNumber} onChangeText={setHpNumber} placeholder="010-0000-0000" />
        <TextField label="생년월일" value={birthDate} onChangeText={setBirthDate} placeholder="2000-01-01" />
        <TextField label="주소" value={address} onChangeText={setAddress} placeholder="주소" />
        <TextField label="상세 주소" value={addressExtra} onChangeText={setAddressExtra} placeholder="상세 주소" />
        <TextField label="전화번호" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="02-000-0000" />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title={isSubmitting ? '가입 중...' : '회원가입'} onPress={handleSignup} disabled={isSubmitting} />

        <View style={styles.linkRow}>
          <Text style={styles.linkLabel}>이미 계정이 있나요?</Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.link}>로그인</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl
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
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs
  },
  linkLabel: {
    ...typography.caption,
    color: colors.textSecondary
  },
  link: {
    ...typography.caption,
    color: colors.primary
  }
})
