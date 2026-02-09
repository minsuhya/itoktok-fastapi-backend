import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useRouter } from 'expo-router'

import Screen from '@/components/ui/Screen'
import SectionHeader from '@/components/ui/SectionHeader'
import Card from '@/components/ui/Card'
import { colors, spacing, typography } from '@/lib/theme'
import { ClientInfo, getClients } from '@/lib/api/clients'

export default function ClientsScreen() {
  const router = useRouter()
  const [clients, setClients] = useState<ClientInfo[]>([])

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const response = await getClients(1, 50)
        const items = response?.items ?? []
        if (isMounted) {
          setClients(items)
        }
      } catch (error) {
        if (isMounted) {
          setClients([])
        }
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Screen>
      <FlatList
        contentContainerStyle={styles.container}
        data={clients}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={() => (
          <SectionHeader title="내담자" subtitle="오늘도 따뜻하게 돌봐주세요." />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(tabs)/clients/${item.id}`)}>
            <Card style={styles.card}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.client_name?.slice(0, 1) || '?'}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.client_name}</Text>
                <Text style={styles.meta}>{item.birth_date || '생년 미등록'}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.md
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  avatarText: {
    ...typography.subtitle,
    color: colors.primary
  },
  info: {
    flex: 1
  },
  name: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs
  },
  chevron: {
    color: colors.textSecondary,
    fontSize: 22
  }
})
