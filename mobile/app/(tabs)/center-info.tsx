import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import axios from 'axios'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import TextField from '@/components/ui/TextField'
import Button from '@/components/ui/Button'
import { colors, spacing, typography } from '@/lib/theme'
import { getCenterInfo, updateCenterInfo } from '@/lib/api/center'
import { toApiErrorMessage } from '@/lib/api/utils'
import { useAuth } from '@/lib/auth'

export default function CenterInfoScreen() {
  const { user } = useAuth()

  const [centerName, setCenterName] = useState('')
  const [centerSummary, setCenterSummary] = useState('')
  const [centerIntroduce, setCenterIntroduce] = useState('')
  const [centerExport, setCenterExport] = useState('')
  const [centerAddr, setCenterAddr] = useState('')
  const [centerTel, setCenterTel] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const centerUsername = useMemo(() => user?.center_username || user?.username || '', [user?.center_username, user?.username])

  useEffect(() => {
    const load = async () => {
      if (!centerUsername) {
        setError('센터 정보를 확인할 수 없습니다.')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const detail = await getCenterInfo(centerUsername)
        setCenterName(detail.center_name || '')
        setCenterSummary(detail.center_summary || '')
        setCenterIntroduce(detail.center_introduce || '')
        setCenterExport(detail.center_export || '')
        setCenterAddr(detail.center_addr || '')
        setCenterTel(detail.center_tel || '')
        setError('')
      } catch (loadError) {
        if (axios.isAxiosError(loadError) && loadError.response?.status === 404) {
          setError('')
          return
        }
        setError(toApiErrorMessage(loadError, '센터 정보를 불러오지 못했습니다.'))
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [centerUsername])

  const handleSubmit = async () => {
    if (isSubmitting || !centerUsername) {
      return
    }

    if (!centerName.trim()) {
      setError('센터명을 입력해주세요.')
      return
    }

    if (!centerTel.trim()) {
      setError('센터 전화번호를 입력해주세요.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await updateCenterInfo(centerUsername, {
        username: centerUsername,
        center_name: centerName.trim(),
        center_summary: centerSummary.trim(),
        center_introduce: centerIntroduce.trim(),
        center_export: centerExport.trim(),
        center_addr: centerAddr.trim(),
        center_tel: centerTel.trim()
      })
      setSuccess('센터 정보가 저장되었습니다.')
    } catch (submitError) {
      setError(toApiErrorMessage(submitError, '센터 정보를 저장하지 못했습니다.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Screen backgroundColor={colors.surface}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <SectionHeader title="센터 정보" subtitle="센터 기본 정보를 수정하세요." />

        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.loadingText}>센터 정보를 불러오는 중입니다...</Text>
          </View>
        ) : null}

        <TextField label="센터명" value={centerName} onChangeText={setCenterName} placeholder="센터명" />
        <TextField label="센터 전화번호" value={centerTel} onChangeText={setCenterTel} placeholder="02-000-0000" />
        <TextField
          label="센터 한줄소개"
          value={centerSummary}
          onChangeText={setCenterSummary}
          placeholder="센터 한줄소개"
        />
        <TextField
          label="센터 소개"
          value={centerIntroduce}
          onChangeText={setCenterIntroduce}
          placeholder="센터 소개"
        />
        <TextField label="전문분야" value={centerExport} onChangeText={setCenterExport} placeholder="전문분야" />
        <TextField label="센터 주소" value={centerAddr} onChangeText={setCenterAddr} placeholder="센터 주소" />

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
