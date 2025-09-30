
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
}

export default function ChatsScreen() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const storedChats = await AsyncStorage.getItem('chats');
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      } else {
        // Demo data
        const demoChats: Chat[] = [
          {
            id: '1',
            name: 'Анна Иванова',
            lastMessage: 'Привет! Как дела?',
            timestamp: '14:30',
            unreadCount: 2,
            avatar: '👩‍💼',
            isOnline: true,
          },
          {
            id: '2',
            name: 'Михаил Петров',
            lastMessage: 'Созвонимся завтра?',
            timestamp: '12:15',
            unreadCount: 0,
            avatar: '👨‍💻',
            isOnline: false,
          },
          {
            id: '3',
            name: 'Елена Сидорова',
            lastMessage: 'Отправила файлы',
            timestamp: 'Вчера',
            unreadCount: 1,
            avatar: '👩‍🎨',
            isOnline: true,
          },
        ];
        setChats(demoChats);
        await AsyncStorage.setItem('chats', JSON.stringify(demoChats));
      }
    } catch (error) {
      console.log('Error loading chats:', error);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: Chat }) => (
    <Pressable
      style={styles.chatItem}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <Pressable
        style={styles.callButton}
        onPress={() => router.push(`/video-call/${item.id}`)}
      >
        <IconSymbol name="video" size={20} color={colors.primary} />
      </Pressable>
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Чаты</Text>
        <Pressable
          style={styles.newChatButton}
          onPress={() => router.push('/contacts')}
        >
          <IconSymbol name="plus" size={24} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск чатов..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatsList}
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
  newChatButton: {
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
  chatsList: {
    flex: 1,
  },
  chatItem: {
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
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.online,
    borderWidth: 2,
    borderColor: colors.background,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
