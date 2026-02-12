import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import TextField from '@/components/ui/TextField'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import { colors, spacing, typography } from '@/lib/theme'
import { getUser, updateUser } from '@/lib/api/users'
import { toApiErrorMessage } from '@/lib/api/utils'
import { useAuth } from '@/lib/auth'

export default function MyInfoScreen() {
  const { user: currentUser } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [address, setAddress] = useState('')
  const [addressExtra, setAddressExtra] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [hpNumber, setHpNumber] = useState('')
  const [userType, setUserType] = useState('2')
  const [centerUsername, setCenterUsername] = useState('')
  const [isActive, setIsActive] = useState(1)
  const [isSuperuser, setIsSuperuser] = useState(0)
  const [userColor, setUserColor] = useState('#5D8B78')
  const [expertise, setExpertise] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const userId = useMemo(() => Number(currentUser?.id || 0), [currentUser?.id])

  useEffect(() => {
    const load = async () => {
      if (!userId) {
        setIsLoading(false)
        setError('사용자 정보를 확인할 수 없습니다.')
        return
      }

      setIsLoading(true)
      try {
        const detail = await getUser(userId)
        setUsername(detail.username || '')
        setEmail(detail.email || '')
        setFullName(detail.full_name || '')
        setBirthDate(detail.birth_date || '')
        setZipCode(detail.zip_code || '')
        setAddress(detail.address || '')
        setAddressExtra(detail.address_extra || '')
        setPhoneNumber(detail.phone_number || '')
        setHpNumber(detail.hp_number || '')
        setUserType(detail.user_type || '2')
        setCenterUsername(detail.center_username || currentUser?.center_username || currentUser?.username || '')
        setIsActive(detail.is_active ?? 1)
        setIsSuperuser(detail.is_superuser ?? 0)
        setUserColor(detail.usercolor || '#5D8B78')
        setExpertise(detail.expertise || '')
        setError('')
      } catch (loadError) {
        setError(toApiErrorMessage(loadError, '내 정보를 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [userId, currentUser?.center_username, currentUser?.username])

  const handleSubmit = async () => {
    if (!userId || isSubmitting) {
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

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await updateUser(userId, {
        username: username.trim(),
        password: password.trim(),
        email: email.trim(),
        full_name: fullName.trim(),
        birth_date: birthDate.trim(),
        zip_code: zipCode.trim(),
        address: address.trim(),
        address_extra: addressExtra.trim(),
        phone_number: phoneNumber.trim(),
        hp_number: hpNumber.trim(),
        user_type: userType,
        center_username: centerUsername.trim(),
        is_active: isActive,
        is_superuser: isSuperuser,
        usercolor: userColor.trim() || '#5D8B78',
        expertise: expertise.trim()
      })
      setSuccess('내 정보가 저장되었습니다.')
      setPassword('')
    } catch (submitError) {
      setError(toApiErrorMessage(submitError, '내 정보를 저장하지 못했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Screen backgroundColor={colors.surface}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <SectionHeader title="내 정보" subtitle="계정 정보를 수정하세요." />

        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>내 정보를 불러오는 중입니다...</Text>
          </View>
        ) : null}

        <TextField label="아이디" value={username} onChangeText={setUsername} placeholder="아이디" />
        <TextField
          label="비밀번호 변경 (선택)"
          value={password}
          onChangeText={setPassword}
          placeholder="변경할 비밀번호"
          secureTextEntry
        />
        <TextField label="이메일" value={email} onChangeText={setEmail} placeholder="me@example.com" />
        <TextField label="이름" value={fullName} onChangeText={setFullName} placeholder="이름" />
        <TextField label="휴대폰번호" value={hpNumber} onChangeText={setHpNumber} placeholder="010-0000-0000" />
        <TextField label="전화번호" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="02-000-0000" />
        <TextField label="전문분야" value={expertise} onChangeText={setExpertise} placeholder="미술치료" />
        <TextField label="생년월일" value={birthDate} onChangeText={setBirthDate} placeholder="2000-01-01" />
        <TextField label="우편번호" value={zipCode} onChangeText={setZipCode} placeholder="00000" />
        <TextField label="주소" value={address} onChangeText={setAddress} placeholder="주소" />
        <TextField label="상세 주소" value={addressExtra} onChangeText={setAddressExtra} placeholder="상세 주소" />
        <TextField label="일정 색상(hex)" value={userColor} onChangeText={setUserColor} placeholder="#5D8B78" />

        <Text style={styles.label}>상태</Text>
        <View style={styles.chipRow}>
          <Chip label="활성" selected={isActive === 1} onPress={() => setIsActive(1)} />
          <Chip label="비활성" selected={isActive === 0} onPress={() => setIsActive(0)} />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <View style={styles.actions}>
          <Button
            title={isSubmitting ? '저장 중...' : '저장'}
            onPress={handleSubmit}
            disabled={isSubmitting || isLoading}
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
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md
  },
  errorText: {
    ...typography.body,
    color: colors.danger,
    marginBottom: spacing.sm
  },
  successText: {
    ...typography.body,
    color: colors.primary,
    marginBottom: spacing.sm
  },
  actions: {
    marginTop: spacing.md
  }
})
