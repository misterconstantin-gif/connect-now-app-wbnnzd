
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';

interface MessageBubbleProps {
  text: string;
  isSent: boolean;
  timestamp: Date;
  type?: 'text' | 'image' | 'file';
  fileName?: string;
  onPress?: () => void;
}

export function MessageBubble({ 
  text, 
  isSent, 
  timestamp, 
  type = 'text',
  fileName,
  onPress 
}: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = () => {
    switch (type) {
      case 'image':
        return (
          <View>
            <Text style={styles.fileIcon}>📷</Text>
            <Text style={[
              commonStyles.messageText,
              isSent ? commonStyles.sentMessageText : commonStyles.receivedMessageText,
            ]}>
              {fileName || 'Изображение'}
            </Text>
          </View>
        );
      case 'file':
        return (
          <View>
            <Text style={styles.fileIcon}>📎</Text>
            <Text style={[
              commonStyles.messageText,
              isSent ? commonStyles.sentMessageText : commonStyles.receivedMessageText,
            ]}>
              {fileName || 'Файл'}
            </Text>
          </View>
        );
      default:
        return (
          <Text style={[
            commonStyles.messageText,
            isSent ? commonStyles.sentMessageText : commonStyles.receivedMessageText,
          ]}>
            {text}
          </Text>
        );
    }
  };

  return (
    <Pressable
      style={[
        styles.container,
        isSent ? styles.sentContainer : styles.receivedContainer,
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[
        commonStyles.chatBubble,
        isSent ? commonStyles.sentMessage : commonStyles.receivedMessage,
      ]}>
        {renderContent()}
        <Text style={[
          styles.timestamp,
          isSent ? styles.sentTimestamp : styles.receivedTimestamp,
        ]}>
          {formatTime(timestamp)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 2,
  },
  sentContainer: {
    alignItems: 'flex-end',
  },
  receivedContainer: {
    alignItems: 'flex-start',
  },
  fileIcon: {
    fontSize: 20,
    marginBottom: 4,
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
});
