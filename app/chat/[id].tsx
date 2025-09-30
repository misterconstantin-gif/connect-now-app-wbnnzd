
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
import { ContactAvatar } from '@/components/ContactAvatar';
import { colors, commonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import uuid from 'react-native-uuid';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isSent: boolean;
  type: 'text' | 'image' | 'file';
  fileUri?: string;
  fileName?: string;
  fileSize?: string;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactAvatar, setContactAvatar] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadChatData();
    loadMessages();
  }, [id]);

  const loadChatData = async () => {
    try {
      const contactNames: { [key: string]: { name: string; avatar: string } } = {
        '1': { name: 'Ada Miles', avatar: '👩‍💼' },
        '2': { name: 'William Hayes', avatar: '👨‍💻' },
        '3': { name: 'Grace Brooks', avatar: '👩‍🎨' },
        '4': { name: 'Anna Giovanni', avatar: '👩‍🔬' },
        '5': { name: 'Emma Barnes', avatar: '👩‍🏫' },
        '6': { name: 'Benjamin Cruz', avatar: '👨‍⚕️' },
      };
      
      const contact = contactNames[id as string] || { name: 'Unknown', avatar: '👤' };
      setContactName(contact.name);
      setContactAvatar(contact.avatar);
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
        // Demo messages based on the contact
        let demoMessages: Message[] = [];
        
        if (id === '3') { // Grace Brooks - show file sharing example
          demoMessages = [
            {
              id: '1',
              text: 'Hi! I have the document ready for you.',
              timestamp: new Date(Date.now() - 3600000),
              isSent: false,
              type: 'text',
            },
            {
              id: '2',
              text: 'The document is attached',
              timestamp: new Date(Date.now() - 3500000),
              isSent: false,
              type: 'file',
              fileName: 'document.pdf',
              fileSize: '2.4 MB',
            },
            {
              id: '3',
              text: 'Thank you!',
              timestamp: new Date(Date.now() - 3000000),
              isSent: true,
              type: 'text',
            },
          ];
        } else {
          demoMessages = [
            {
              id: '1',
              text: 'Hello! How are you?',
              timestamp: new Date(Date.now() - 3600000),
              isSent: false,
              type: 'text',
            },
            {
              id: '2',
              text: 'Hi! I\'m doing great, thanks! How about you?',
              timestamp: new Date(Date.now() - 3500000),
              isSent: true,
              type: 'text',
            },
            {
              id: '3',
              text: 'All good here too. Want to have a video call?',
              timestamp: new Date(Date.now() - 3000000),
              isSent: false,
              type: 'text',
            },
          ];
        }
        
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

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const pickFile = async () => {
    Alert.alert(
      'Select File',
      'Choose the type of file to send',
      [
        { text: 'Photo', onPress: pickImage },
        { text: 'Document', onPress: pickDocument },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Permission to access gallery is required');
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
          text: 'Photo',
          timestamp: new Date(),
          isSent: true,
          type: 'image',
          fileUri: asset.uri,
          fileName: asset.fileName || 'image.jpg',
          fileSize: '1.2 MB',
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
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newMessage: Message = {
          id: uuid.v4() as string,
          text: 'Document',
          timestamp: new Date(),
          isSent: true,
          type: 'file',
          fileUri: asset.uri,
          fileName: asset.name,
          fileSize: `${(asset.size! / 1024 / 1024).toFixed(1)} MB`,
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        saveMessages(updatedMessages);

        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.log('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const startVideoCall = () => {
    router.push(`/video-call/${id}`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSent ? styles.sentMessageContainer : styles.receivedMessageContainer,
      ]}
    >
      {!item.isSent && (
        <ContactAvatar 
          name={contactName} 
          emoji={contactAvatar} 
          size={32}
        />
      )}
      
      <View
        style={[
          styles.messageBubble,
          item.isSent ? styles.sentBubble : styles.receivedBubble,
        ]}
      >
        {item.type === 'file' ? (
          <View style={styles.fileMessage}>
            <View style={styles.fileIcon}>
              <IconSymbol 
                name="doc.text" 
                size={20} 
                color={item.isSent ? '#FFFFFF' : colors.primary} 
              />
            </View>
            <View style={styles.fileInfo}>
              <Text
                style={[
                  styles.fileName,
                  item.isSent ? styles.sentText : styles.receivedText,
                ]}
              >
                {item.fileName}
              </Text>
              {item.fileSize && (
                <Text
                  style={[
                    styles.fileSize,
                    item.isSent ? styles.sentTextSecondary : styles.receivedTextSecondary,
                  ]}
                >
                  {item.fileSize}
                </Text>
              )}
            </View>
          </View>
        ) : item.type === 'image' ? (
          <View style={styles.fileMessage}>
            <View style={styles.fileIcon}>
              <IconSymbol 
                name="photo" 
                size={20} 
                color={item.isSent ? '#FFFFFF' : colors.primary} 
              />
            </View>
            <View style={styles.fileInfo}>
              <Text
                style={[
                  styles.fileName,
                  item.isSent ? styles.sentText : styles.receivedText,
                ]}
              >
                {item.fileName}
              </Text>
              {item.fileSize && (
                <Text
                  style={[
                    styles.fileSize,
                    item.isSent ? styles.sentTextSecondary : styles.receivedTextSecondary,
                  ]}
                >
                  {item.fileSize}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <Text
            style={[
              styles.messageText,
              item.isSent ? styles.sentText : styles.receivedText,
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
      
      {item.isSent && (
        <ContactAvatar 
          name="You" 
          emoji="👤" 
          size={32}
        />
      )}
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
          
          <ContactAvatar 
            name={contactName} 
            emoji={contactAvatar} 
            size={40}
            isOnline={true}
          />
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{contactName}</Text>
            <Text style={styles.headerSubtitle}>online</Text>
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
            onPress={pickFile}
          >
            <IconSymbol name="paperclip" size={24} color={colors.primary} />
          </Pressable>
          
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Message"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={1000}
              placeholderTextColor={colors.textSecondary}
            />
            
            <Pressable
              style={styles.emojiButton}
              onPress={() => console.log('Emoji picker')}
            >
              <Text style={styles.emojiText}>😊</Text>
            </Pressable>
          </View>
          
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
    marginLeft: 12,
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
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  sentMessageContainer: {
    justifyContent: 'flex-end',
  },
  receivedMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
    marginHorizontal: 8,
  },
  sentBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: colors.backgroundAlt,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentText: {
    color: '#FFFFFF',
  },
  receivedText: {
    color: colors.text,
  },
  fileMessage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
  },
  fileSize: {
    fontSize: 12,
    marginTop: 2,
  },
  sentTextSecondary: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receivedTextSecondary: {
    color: colors.textSecondary,
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
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
  },
  emojiButton: {
    marginLeft: 8,
  },
  emojiText: {
    fontSize: 20,
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
