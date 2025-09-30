
import { Tabs } from 'expo-router';
import React from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: 20,
          paddingTop: 10,
          height: 90,
        },
      }}>
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Чаты',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name="message" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Контакты',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name="person.2" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Настройки',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol size={28} name="gear" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
