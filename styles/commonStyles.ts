
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  primary: '#007AFF',      // iOS Blue
  secondary: '#5856D6',    // iOS Purple
  accent: '#FF3B30',       // iOS Red
  background: '#FFFFFF',   // White background for light theme
  backgroundAlt: '#F2F2F7', // Light gray background
  text: '#000000',         // Black text
  textSecondary: '#8E8E93', // Gray text
  grey: '#C7C7CC',         // Light gray
  card: '#FFFFFF',         // White card background
  border: '#E5E5EA',       // Light border
  success: '#34C759',      // iOS Green
  warning: '#FF9500',      // iOS Orange
  online: '#34C759',       // Online status green
  offline: '#8E8E93',      // Offline status gray
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
  },
  callButton: {
    backgroundColor: colors.success,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButton: {
    backgroundColor: colors.accent,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteButton: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 4,
  },
  sentMessage: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  receivedMessageText: {
    color: colors.text,
  },
  icon: {
    width: 24,
    height: 24,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 20,
    paddingTop: 10,
  },
});
