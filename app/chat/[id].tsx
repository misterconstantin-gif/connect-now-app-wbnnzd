
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isSent: boolean;
  type: 'text' | 'image' | 'file';
  fileUri?: string;
  fileName?: string;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [contactName, setContactName] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChatData();
    loadMessages();
  }, [id]);

  const loadChatData = async () => {
    try {
      const storedChats = await AsyncStorage.getItem('chats');
      if (storedChats) {
        const chats = JSON.parse(storedChats);
        const chat = chats.find((c: any) => c.id === id);
        if (chat) {
          setContactName(chat.name);
        }
      }
    } catch (error) {
      console.log('Error loading chat data:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem(`messages_${id}`);
      if (storedMessages) {
        const parsedMessages = JSON.parse(storedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(parsedMessages);
      } else {
        // Demo messages
        const demoMessages: Message[] = [
          {
            id: '1',
            text: 'Привет! Как дела?',
            timestamp: new Date(Date.now() - 3600000),
            isSent: false,
            type: 'text',
          },
          {
            id: '2',
            text: 'Привет! Всё отлично, спасибо! А у тебя как?',
            timestamp: new Date(Date.now() - 3500000),
            isSent: true,
            type: 'text',
          },
          {
            id: '3',
            text: 'Тоже всё хорошо. Хочешь созвониться?',
            timestamp: new Date(Date.now() - 3000000),
            isSent: false,
            type: 'text',
          },
        ];
        setMessages(demoMessages);
      }
    } catch (error) {
      console.log('Error loading messages:', error);
    }
  };

  const saveMessages = async (newMessages: Message[]) => {
    try {
      await AsyncStorage.setItem(`messages_${id}`, JSON.stringify(newMessages));
    } catch (error) {
      console.log('Error saving messages:', error);
    }
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: uuid.v4() as string,
        text: inputText.trim(),
        timestamp: new Date(),
        isSent: true,
        type: 'text',
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
      setInputText('');

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходимо разрешение для доступа к галерее');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newMessage: Message = {
          id: uuid.v4() as string,
          text: 'Изображение',
          timestamp: new Date(),
          isSent: true,
          type: 'image',
          fileUri: asset.uri,
          fileName: asset.fileName || 'image.jpg',
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        saveMessages(updatedMessages);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать изображение');
    }
  };

  const startVideoCall = () => {
    router.push(`/video-call/${id}`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSent ? styles.sentMessageContainer : styles.receivedMessageContainer,
      ]}
    >
      <View
        style={[
          commonStyles.chatBubble,
          item.isSent ? commonStyles.sentMessage : commonStyles.receivedMessage,
        ]}
      >
        {item.type === 'image' && item.fileUri ? (
          <View>
            <Text
              style={[
                commonStyles.messageText,
                item.isSent ? commonStyles.sentMessageText : commonStyles.receivedMessageText,
              ]}
            >
              📷 {item.fileName}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              commonStyles.messageText,
              item.isSent ? commonStyles.sentMessageText : commonStyles.receivedMessageText,
            ]}
          >
            {item.text}
          </Text>
        )}
        <Text
          style={[
            styles.timestamp,
            item.isSent ? styles.sentTimestamp : styles.receivedTimestamp,
          ]}
        >
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.primary} />
          </Pressable>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{contactName}</Text>
            <Text style={styles.headerSubtitle}>в сети</Text>
          </View>

          <Pressable
            style={styles.callButton}
            onPress={startVideoCall}
          >
            <IconSymbol name="video" size={24} color={colors.primary} />
          </Pressable>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <Pressable
            style={styles.attachButton}
            onPress={pickImage}
          >
            <IconSymbol name="paperclip" size={24} color={colors.primary} />
          </Pressable>
          
          <TextInput
            style={styles.textInput}
            placeholder="Сообщение..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            placeholderTextColor={colors.textSecondary}
          />
          
          <Pressable
            style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : null]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <IconSymbol
              name="arrow.up"
              size={20}
              color={inputText.trim() ? '#FFFFFF' : colors.textSecondary}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.online,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    paddingHorizontal: 16,
    marginVertical: 2,
  },
  sentMessageContainer: {
    alignItems: 'flex-end',
  },
  receivedMessageContainer: {
    alignItems: 'flex-start',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  sentTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receivedTimestamp: {
    color: colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.backgroundAlt,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
});
