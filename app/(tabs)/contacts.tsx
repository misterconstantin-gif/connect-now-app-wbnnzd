
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
import { ContactAvatar } from '@/components/ContactAvatar';
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

  useEffect(() => {
    requestContactsPermission();
  }, []);

  const requestContactsPermission = async () => {
    try {
      if (Platform.OS === 'web') {
        loadDemoContacts();
        return;
      }

      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        loadContacts();
      } else {
        Alert.alert(
          'Permission Required',
          'Access to contacts is needed to show your contacts list.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => console.log('Open settings') },
          ]
        );
        loadDemoContacts();
      }
    } catch (error) {
      console.log('Error requesting contacts permission:', error);
      loadDemoContacts();
    }
  };

  const loadContacts = async () => {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
      });

      if (data.length > 0) {
        const formattedContacts: Contact[] = data
          .filter(contact => contact.name)
          .slice(0, 20)
          .map(contact => ({
            id: contact.id || Math.random().toString(),
            name: contact.name || 'Unknown',
            phoneNumber: contact.phoneNumbers?.[0]?.number,
            avatar: getRandomAvatar(),
            isRegistered: Math.random() > 0.5,
          }));

        setContacts(formattedContacts);
      } else {
        loadDemoContacts();
      }
    } catch (error) {
      console.log('Error loading contacts:', error);
      loadDemoContacts();
    }
  };

  const loadDemoContacts = () => {
    const demoContacts: Contact[] = [
      {
        id: '1',
        name: 'Ada Miles',
        phoneNumber: '+1 (555) 123-4567',
        avatar: '👩‍💼',
        isRegistered: true,
      },
      {
        id: '2',
        name: 'William Hayes',
        phoneNumber: '+1 (555) 234-5678',
        avatar: '👨‍💻',
        isRegistered: true,
      },
      {
        id: '3',
        name: 'Grace Brooks',
        phoneNumber: '+1 (555) 345-6789',
        avatar: '👩‍🎨',
        isRegistered: true,
      },
      {
        id: '4',
        name: 'Anna Giovanni',
        phoneNumber: '+1 (555) 456-7890',
        avatar: '👩‍🔬',
        isRegistered: true,
      },
      {
        id: '5',
        name: 'Emma Barnes',
        phoneNumber: '+1 (555) 567-8901',
        avatar: '👩‍🏫',
        isRegistered: false,
      },
      {
        id: '6',
        name: 'Benjamin Cruz',
        phoneNumber: '+1 (555) 678-9012',
        avatar: '👨‍⚕️',
        isRegistered: true,
      },
      {
        id: '7',
        name: 'Sarah Johnson',
        phoneNumber: '+1 (555) 789-0123',
        avatar: '👩‍💻',
        isRegistered: false,
      },
      {
        id: '8',
        name: 'Michael Brown',
        phoneNumber: '+1 (555) 890-1234',
        avatar: '👨‍🎨',
        isRegistered: true,
      },
    ];
    setContacts(demoContacts);
  };

  const getRandomAvatar = () => {
    const avatars = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨', '👨‍⚕️', '👩‍⚕️', '👨‍🏫', '👩‍🏫'];
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
        'User Not Registered',
        `${contact.name} is not using this app yet. Would you like to invite them?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Invite', onPress: () => console.log('Send invite') },
        ]
      );
    }
  };

  const startVideoCall = (contact: Contact) => {
    if (contact.isRegistered) {
      router.push(`/video-call/${contact.id}`);
    } else {
      Alert.alert(
        'User Not Registered',
        `${contact.name} is not using this app yet.`
      );
    }
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <Pressable
      style={styles.contactItem}
      onPress={() => startChat(item)}
    >
      <ContactAvatar 
        name={item.name} 
        emoji={item.avatar} 
        size={50}
        isOnline={item.isRegistered}
      />
      
      <View style={styles.contactContent}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
        {!item.isRegistered && (
          <Text style={styles.inviteText}>Invite to app</Text>
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
        <Text style={styles.headerTitle}>Contacts</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => console.log('Add contact')}
        >
          <IconSymbol name="plus" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
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
  addButton: {
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
  contactContent: {
    flex: 1,
    marginLeft: 12,
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
