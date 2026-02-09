import React from 'react'
import { Tabs } from 'expo-router'
import { Feather } from '@expo/vector-icons'

import { colors } from '@/lib/theme'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.surface
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: '일정',
          tabBarIcon: ({ color, size }) => <Feather name="calendar" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: '내담자',
          tabBarIcon: ({ color, size }) => <Feather name="users" color={color} size={size} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '설정',
          tabBarIcon: ({ color, size }) => <Feather name="settings" color={color} size={size} />
        }}
      />
    </Tabs>
  )
}
