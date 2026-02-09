import { Link, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

import { colors, typography } from '@/lib/theme'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>페이지를 찾을 수 없습니다.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>홈으로 돌아가기</Text>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    ...typography.caption,
    color: colors.primary
  }
})
