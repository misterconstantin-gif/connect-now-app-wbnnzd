
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
import { ContactAvatar } from '@/components/ContactAvatar';
import { colors, commonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
}

interface Call {
  id: string;
  name: string;
  type: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  avatar: string;
  duration?: string;
}

interface FileItem {
  id: string;
  name: string;
  fileName: string;
  type: 'document' | 'image' | 'video';
  timestamp: string;
  size: string;
  avatar: string;
}

function ChatsTab() {
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
        const demoChats: Chat[] = [
          {
            id: '1',
            name: 'Ada Miles',
            lastMessage: 'I\'ll be there by 5 pm.',
            timestamp: '10:24',
            unreadCount: 0,
            avatar: '👩‍💼',
            isOnline: true,
          },
          {
            id: '2',
            name: 'William Hayes',
            lastMessage: 'Got it, see you then!',
            timestamp: '05:50',
            unreadCount: 0,
            avatar: '👨‍💻',
            isOnline: false,
          },
          {
            id: '3',
            name: 'Grace Brooks',
            lastMessage: 'The document is...',
            timestamp: 'Yest-',
            unreadCount: 1,
            avatar: '👩‍🎨',
            isOnline: true,
          },
          {
            id: '4',
            name: 'Anna Giovanni',
            lastMessage: 'I\'m currently away',
            timestamp: 'Yest',
            unreadCount: 0,
            avatar: '👩‍🔬',
            isOnline: false,
          },
          {
            id: '5',
            name: 'Emma Barnes',
            lastMessage: 'Absolutely, anytime!',
            timestamp: 'Thu',
            unreadCount: 0,
            avatar: '👩‍🏫',
            isOnline: true,
          },
          {
            id: '6',
            name: 'Benjamin Cruz',
            lastMessage: 'Conference resche...',
            timestamp: 'Wed',
            unreadCount: 0,
            avatar: '👨‍⚕️',
            isOnline: false,
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
      <ContactAvatar 
        name={item.name} 
        emoji={item.avatar} 
        isOnline={item.isOnline}
        size={50}
      />
      
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
    </Pressable>
  );

  return (
    <View style={styles.tabContainer}>
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={16} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
        <View style={styles.searchBadge}>
          <Text style={styles.searchBadgeText}>1</Text>
        </View>
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function CallsTab() {
  const [calls, setCalls] = useState<Call[]>([]);

  useEffect(() => {
    loadCalls();
  }, []);

  const loadCalls = async () => {
    const demoCalls: Call[] = [
      {
        id: '1',
        name: 'Ada Miles',
        type: 'outgoing',
        timestamp: '10:24',
        avatar: '👩‍💼',
        duration: '5:32',
      },
      {
        id: '2',
        name: 'William Hayes',
        type: 'incoming',
        timestamp: '05:50',
        avatar: '👨‍💻',
        duration: '2:15',
      },
      {
        id: '3',
        name: 'Grace Brooks',
        type: 'missed',
        timestamp: 'Yesterday',
        avatar: '👩‍🎨',
      },
    ];
    setCalls(demoCalls);
  };

  const renderCallItem = ({ item }: { item: Call }) => (
    <Pressable
      style={styles.chatItem}
      onPress={() => router.push(`/video-call/${item.id}`)}
    >
      <ContactAvatar 
        name={item.name} 
        emoji={item.avatar} 
        size={50}
      />
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messageRow}>
          <View style={styles.callInfo}>
            <IconSymbol 
              name={item.type === 'incoming' ? 'arrow.down.left' : item.type === 'outgoing' ? 'arrow.up.right' : 'phone.down'} 
              size={14} 
              color={item.type === 'missed' ? colors.accent : colors.textSecondary} 
            />
            <Text style={[styles.callType, item.type === 'missed' && { color: colors.accent }]}>
              {item.type === 'incoming' ? 'Incoming' : item.type === 'outgoing' ? 'Outgoing' : 'Missed'}
              {item.duration && ` • ${item.duration}`}
            </Text>
          </View>
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
    <View style={styles.tabContainer}>
      <FlatList
        data={calls}
        renderItem={renderCallItem}
        keyExtractor={(item) => item.id}
        style={styles.chatsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function FilesTab() {
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const demoFiles: FileItem[] = [
      {
        id: '1',
        name: 'Grace Brooks',
        fileName: 'document.pdf',
        type: 'document',
        timestamp: 'Yesterday',
        size: '2.4 MB',
        avatar: '👩‍🎨',
      },
      {
        id: '2',
        name: 'Ada Miles',
        fileName: 'presentation.pptx',
        type: 'document',
        timestamp: '2 days ago',
        size: '5.1 MB',
        avatar: '👩‍💼',
      },
      {
        id: '3',
        name: 'William Hayes',
        fileName: 'photo.jpg',
        type: 'image',
        timestamp: '3 days ago',
        size: '1.2 MB',
        avatar: '👨‍💻',
      },
    ];
    setFiles(demoFiles);
  };

  const renderFileItem = ({ item }: { item: FileItem }) => (
    <Pressable style={styles.chatItem}>
      <ContactAvatar 
        name={item.name} 
        emoji={item.avatar} 
        size={50}
      />
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messageRow}>
          <View style={styles.fileInfo}>
            <IconSymbol 
              name={item.type === 'document' ? 'doc.text' : item.type === 'image' ? 'photo' : 'video'} 
              size={14} 
              color={colors.primary} 
            />
            <Text style={styles.fileName}>{item.fileName}</Text>
            <Text style={styles.fileSize}>• {item.size}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={files}
        renderItem={renderFileItem}
        keyExtractor={(item) => item.id}
        style={styles.chatsList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default function ChatsScreen() {
  return (
    <SafeAreaView style={commonStyles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
            height: 2,
          },
          tabBarStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: '600',
            textTransform: 'none',
          },
        }}
      >
        <Tab.Screen name="Chats" component={ChatsTab} />
        <Tab.Screen name="Calls" component={CallsTab} />
        <Tab.Screen name="Files" component={FilesTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 10,
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
  searchBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  chatsList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  chatContent: {
    flex: 1,
    marginLeft: 12,
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
    fontSize: 14,
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
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callType: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileName: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 6,
  },
  fileSize: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
