
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface ContactAvatarProps {
  name: string;
  size?: number;
  emoji?: string;
  isOnline?: boolean;
}

export function ContactAvatar({ name, size = 50, emoji, isOnline }: ContactAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const textSize = {
    fontSize: emoji ? size * 0.6 : size * 0.35,
  };

  return (
    <View style={[styles.container, avatarSize]}>
      <Text style={[styles.text, textSize]}>
        {emoji || getInitials(name)}
      </Text>
      {isOnline && (
        <View 
          style={[
            styles.onlineIndicator, 
            { 
              width: size * 0.25, 
              height: size * 0.25, 
              borderRadius: size * 0.125,
              bottom: size * 0.05,
              right: size * 0.05,
            }
          ]} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  text: {
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    backgroundColor: colors.online,
    borderWidth: 2,
    borderColor: colors.background,
  },
});

export default ContactAvatar;
