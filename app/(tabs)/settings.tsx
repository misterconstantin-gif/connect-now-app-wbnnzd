
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [p2pEnabled, setP2pEnabled] = useState(false);

  const settingsItems = [
    {
      id: 'profile',
      title: 'Профиль',
      subtitle: 'Имя, фото, статус',
      icon: 'person.circle',
      onPress: () => console.log('Profile pressed'),
    },
    {
      id: 'privacy',
      title: 'Конфиденциальность',
      subtitle: 'Блокировка, последнее посещение',
      icon: 'lock.shield',
      onPress: () => console.log('Privacy pressed'),
    },
    {
      id: 'storage',
      title: 'Хранилище и данные',
      subtitle: 'Использование сети и хранилища',
      icon: 'internaldrive',
      onPress: () => console.log('Storage pressed'),
    },
    {
      id: 'help',
      title: 'Помощь',
      subtitle: 'FAQ, связаться с нами',
      icon: 'questionmark.circle',
      onPress: () => console.log('Help pressed'),
    },
  ];

  const handleP2PToggle = (value: boolean) => {
    if (value) {
      Alert.alert(
        'Peer-to-Peer соединение',
        'Включить прямое соединение между устройствами? Это может улучшить качество связи, но потребует дополнительных разрешений.',
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Включить', onPress: () => setP2pEnabled(true) },
        ]
      );
    } else {
      setP2pEnabled(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Настройки</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>👤</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Мой профиль</Text>
            <Text style={styles.profileStatus}>В сети</Text>
          </View>
          <Pressable style={styles.editButton}>
            <IconSymbol name="pencil" size={20} color={colors.primary} />
          </Pressable>
        </View>

        {/* Settings Items */}
        <View style={styles.section}>
          {settingsItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.settingItem}
              onPress={item.onPress}
            >
              <View style={styles.settingIcon}>
                <IconSymbol name={item.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Уведомления</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <IconSymbol name="bell" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Уведомления</Text>
              <Text style={styles.settingSubtitle}>Получать уведомления о сообщениях</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.grey, true: colors.primary }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <IconSymbol name="speaker.wave.2" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Звук</Text>
              <Text style={styles.settingSubtitle}>Звуковые уведомления</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: colors.grey, true: colors.primary }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <IconSymbol name="iphone.radiowaves.left.and.right" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Вибрация</Text>
              <Text style={styles.settingSubtitle}>Вибрация при уведомлениях</Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: colors.grey, true: colors.primary }}
            />
          </View>
        </View>

        {/* Connection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Соединение</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <IconSymbol name="network" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Peer-to-Peer</Text>
              <Text style={styles.settingSubtitle}>Прямое соединение между устройствами</Text>
            </View>
            <Switch
              value={p2pEnabled}
              onValueChange={handleP2PToggle}
              trackColor={{ false: colors.grey, true: colors.primary }}
            />
          </View>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <IconSymbol name="server.rack" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Серверы</Text>
              <Text style={styles.settingSubtitle}>Настройки подключения к серверам</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О приложении</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <IconSymbol name="info.circle" size={24} color={colors.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Версия</Text>
              <Text style={styles.settingSubtitle}>1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: 14,
    color: colors.online,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    paddingHorizontal: 20,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
