import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import TextField from '@/components/ui/TextField'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import { colors, spacing, typography } from '@/lib/theme'
import { ClientPayload, createClient, getClient, updateClient } from '@/lib/api/clients'
import { getTeachers } from '@/lib/api/users'
import { toApiErrorMessage } from '@/lib/api/utils'
import { useAuth } from '@/lib/auth'

type TeacherOption = {
  username: string
  full_name: string
}

export default function ClientFormScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const { id } = useLocalSearchParams<{ id?: string }>()

  const [teacherOptions, setTeacherOptions] = useState<TeacherOption[]>([])
  const [consultant, setConsultant] = useState('')
  const [consultantStatus, setConsultantStatus] = useState('1')
  const [clientName, setClientName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [memo, setMemo] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [addressRegion, setAddressRegion] = useState('')
  const [addressCity, setAddressCity] = useState('')
  const [consultationPath, setConsultationPath] = useState('1')
  const [gender, setGender] = useState('')
  const [tags, setTags] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const isEditMode = Boolean(id)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const teachers = await getTeachers()
        setTeacherOptions(teachers)

        if (id) {
          const detail = await getClient(Number(id))
          setConsultant(detail.consultant || '')
          setConsultantStatus(detail.consultant_status || '1')
          setClientName(detail.client_name || '')
          setPhoneNumber(detail.phone_number || '')
          setMemo(detail.memo || '')
          setBirthDate(detail.birth_date || '')
          setEmailAddress(detail.email_address || '')
          setAddressRegion(detail.address_region || '')
          setAddressCity(detail.address_city || '')
          setConsultationPath(detail.consultation_path || '1')
          setGender(detail.gender || '')
          setTags(detail.tags || '')
        }

        setFormError('')
      } catch (error) {
        setTeacherOptions([])
        setFormError(toApiErrorMessage(error, '내담자 정보를 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [id])

  const handleSubmit = async () => {
    if (isSubmitting) return

    if (!consultant) {
      setFormError('상담사를 선택해주세요.')
      return
    }

    if (!clientName.trim()) {
      setFormError('내담자 이름을 입력해주세요.')
      return
    }

    if (!phoneNumber.trim()) {
      setFormError('휴대전화번호를 입력해주세요.')
      return
    }

    const centerUsername = user?.center_username || user?.username || ''
    if (!centerUsername) {
      setFormError('센터 정보를 확인할 수 없습니다.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    const payload: ClientPayload = {
      consultant,
      consultant_status: consultantStatus,
      client_name: clientName.trim(),
      phone_number: phoneNumber.trim(),
      tags,
      memo,
      birth_date: birthDate,
      gender,
      email_address: emailAddress,
      address_region: addressRegion,
      address_city: addressCity,
      consultation_path: consultationPath,
      center_username: centerUsername,
      family_members: ''
    }

    try {
      if (id) {
        await updateClient(Number(id), payload)
      } else {
        await createClient(payload)
      }
      router.back()
    } catch (error) {
      setFormError(toApiErrorMessage(error, '내담자 정보를 저장하지 못했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Screen backgroundColor={colors.surface}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <SectionHeader title={isEditMode ? '내담자 수정' : '내담자 등록'} subtitle="내담자 정보를 입력하세요." />

        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>내담자 정보를 불러오는 중입니다...</Text>
          </View>
        ) : null}

        <Text style={styles.label}>상담사</Text>
        <View style={styles.chipRow}>
          {teacherOptions.map((teacher) => (
            <Chip
              key={teacher.username}
              label={teacher.full_name}
              selected={consultant === teacher.username}
              onPress={() => setConsultant(teacher.username)}
            />
          ))}
        </View>

        <Text style={styles.label}>상담 상태</Text>
        <View style={styles.chipRow}>
          <Chip label="상담진행" selected={consultantStatus === '1'} onPress={() => setConsultantStatus('1')} />
          <Chip label="상담보류" selected={consultantStatus === '2'} onPress={() => setConsultantStatus('2')} />
          <Chip label="상담종결" selected={consultantStatus === '3'} onPress={() => setConsultantStatus('3')} />
        </View>

        <TextField label="내담자 이름" value={clientName} onChangeText={setClientName} placeholder="홍길동" />
        <TextField label="휴대전화번호" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="010-0000-0000" />
        <TextField label="생년월일" value={birthDate} onChangeText={setBirthDate} placeholder="2000-01-01" />
        <TextField label="이메일" value={emailAddress} onChangeText={setEmailAddress} placeholder="client@example.com" />
        <TextField label="지역" value={addressRegion} onChangeText={setAddressRegion} placeholder="서울" />
        <TextField label="상세 주소" value={addressCity} onChangeText={setAddressCity} placeholder="강남구" />
        <TextField label="태그" value={tags} onChangeText={setTags} placeholder="주의집중, 언어" />

        <Text style={styles.label}>상담 신청 경로</Text>
        <View style={styles.chipRow}>
          <Chip label="가족/지인추천" selected={consultationPath === '1'} onPress={() => setConsultationPath('1')} />
          <Chip label="병원/센터" selected={consultationPath === '2'} onPress={() => setConsultationPath('2')} />
          <Chip label="PC/모바일광고" selected={consultationPath === '3'} onPress={() => setConsultationPath('3')} />
          <Chip label="카페/커뮤니티" selected={consultationPath === '4'} onPress={() => setConsultationPath('4')} />
        </View>

        <Text style={styles.label}>성별</Text>
        <View style={styles.chipRow}>
          <Chip label="남성" selected={gender === 'M'} onPress={() => setGender('M')} />
          <Chip label="여성" selected={gender === 'F'} onPress={() => setGender('F')} />
        </View>

        <TextField label="메모" value={memo} onChangeText={setMemo} placeholder="내담자 메모" />

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

        <View style={styles.actions}>
          <Button title={isSubmitting ? '저장 중...' : '저장'} onPress={handleSubmit} disabled={isSubmitting || isLoading} />
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
    marginBottom: spacing.md
  },
  actions: {
    marginTop: spacing.md
  }
})
