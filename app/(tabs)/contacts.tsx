
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import * as Contacts from 'expo-contacts';

interface Contact {
  id: string;
  name: string;
  phoneNumber?: string;
  avatar: string;
  isRegistered: boolean;
}

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestContactsPermission();
  }, []);

  const requestContactsPermission = async () => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        loadContacts();
      } else {
        Alert.alert(
          'Доступ к контактам',
          'Для работы приложения необходим доступ к контактам',
          [
            { text: 'Отмена', style: 'cancel' },
            { text: 'Настройки', onPress: () => console.log('Open settings') },
          ]
        );
      }
    } catch (error) {
      console.log('Error requesting contacts permission:', error);
      loadDemoContacts();
    }
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      const formattedContacts: Contact[] = data
        .filter(contact => contact.name && contact.phoneNumbers?.length)
        .slice(0, 50) // Limit to first 50 contacts
        .map((contact, index) => ({
          id: contact.id || `contact-${index}`,
          name: contact.name || 'Unknown',
          phoneNumber: contact.phoneNumbers?.[0]?.number,
          avatar: getRandomAvatar(),
          isRegistered: Math.random() > 0.7, // Random registration status
        }));

      setContacts(formattedContacts);
    } catch (error) {
      console.log('Error loading contacts:', error);
      loadDemoContacts();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoContacts = () => {
    const demoContacts: Contact[] = [
      {
        id: '1',
        name: 'Анна Иванова',
        phoneNumber: '+7 (999) 123-45-67',
        avatar: '👩‍💼',
        isRegistered: true,
      },
      {
        id: '2',
        name: 'Михаил Петров',
        phoneNumber: '+7 (999) 234-56-78',
        avatar: '👨‍💻',
        isRegistered: true,
      },
      {
        id: '3',
        name: 'Елена Сидорова',
        phoneNumber: '+7 (999) 345-67-89',
        avatar: '👩‍🎨',
        isRegistered: true,
      },
      {
        id: '4',
        name: 'Алексей Смирнов',
        phoneNumber: '+7 (999) 456-78-90',
        avatar: '👨‍🔧',
        isRegistered: false,
      },
      {
        id: '5',
        name: 'Мария Козлова',
        phoneNumber: '+7 (999) 567-89-01',
        avatar: '👩‍⚕️',
        isRegistered: true,
      },
    ];
    setContacts(demoContacts);
  };

  const getRandomAvatar = () => {
    const avatars = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨', '👨‍🔧', '👩‍🔧', '👨‍⚕️', '👩‍⚕️'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startChat = (contact: Contact) => {
    if (contact.isRegistered) {
      router.push(`/chat/${contact.id}`);
    } else {
      Alert.alert(
        'Пригласить в приложение',
        `${contact.name} не использует это приложение. Отправить приглашение?`,
        [
          { text: 'Отмена', style: 'cancel' },
          { text: 'Пригласить', onPress: () => console.log('Send invitation') },
        ]
      );
    }
  };

  const startVideoCall = (contact: Contact) => {
    if (contact.isRegistered) {
      router.push(`/video-call/${contact.id}`);
    } else {
      Alert.alert('Недоступно', 'Пользователь не зарегистрирован в приложении');
    }
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <Pressable
      style={styles.contactItem}
      onPress={() => startChat(item)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
        {item.isRegistered && <View style={styles.registeredIndicator} />}
      </View>
      
      <View style={styles.contactContent}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
        {!item.isRegistered && (
          <Text style={styles.inviteText}>Пригласить в приложение</Text>
        )}
      </View>

      {item.isRegistered && (
        <View style={styles.actionButtons}>
          <Pressable
            style={styles.actionButton}
            onPress={() => startChat(item)}
          >
            <IconSymbol name="message" size={20} color={colors.primary} />
          </Pressable>
          <Pressable
            style={styles.actionButton}
            onPress={() => startVideoCall(item)}
          >
            <IconSymbol name="video" size={20} color={colors.primary} />
          </Pressable>
        </View>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Контакты</Text>
        <Pressable
          style={styles.refreshButton}
          onPress={loadContacts}
        >
          <IconSymbol name="arrow.clockwise" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск контактов..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id}
        style={styles.contactsList}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadContacts}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 32,
    width: 50,
    height: 50,
    textAlign: 'center',
    lineHeight: 50,
    backgroundColor: colors.backgroundAlt,
    borderRadius: 25,
  },
  registeredIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.background,
  },
  contactContent: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  inviteText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
