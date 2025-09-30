
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { Camera, CameraType } from 'expo-camera';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function VideoCallScreen() {
  const { id } = useLocalSearchParams();
  const [contactName, setContactName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [callDuration, setCallDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    requestPermissions();
    loadContactName();
    
    // Simulate call connection after 2 seconds
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 2000);

    // Start call duration timer when connected
    let durationTimer: NodeJS.Timeout;
    if (isConnected) {
      durationTimer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      clearTimeout(connectTimer);
      if (durationTimer) clearInterval(durationTimer);
    };
  }, [isConnected]);

  const requestPermissions = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    } catch (error) {
      console.log('Error requesting camera permission:', error);
      setHasPermission(false);
    }
  };

  const loadContactName = () => {
    // In a real app, this would load from AsyncStorage
    setContactName('Анна Иванова');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const switchCamera = () => {
    setCameraType(
      cameraType === CameraType.back ? CameraType.front : CameraType.back
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const endCall = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'Завершить звонок',
      'Вы уверены, что хотите завершить звонок?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Завершить', 
          style: 'destructive',
          onPress: () => router.back()
        },
      ]
    );
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.statusText}>Запрос разрешений...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.statusText}>Нет доступа к камере</Text>
          <Text style={styles.subtitleText}>
            Для видеозвонков необходимо разрешение на использование камеры
          </Text>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Назад</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Video Area */}
      <View style={styles.videoContainer}>
        {isVideoEnabled ? (
          <Camera
            style={styles.camera}
            type={cameraType}
            ratio="16:9"
          />
        ) : (
          <View style={styles.videoDisabled}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>👩‍💼</Text>
            </View>
          </View>
        )}

        {/* Remote video placeholder */}
        <View style={styles.remoteVideo}>
          {isConnected ? (
            <View style={styles.remoteVideoContent}>
              <View style={styles.avatarMedium}>
                <Text style={styles.avatarMediumText}>👩‍💼</Text>
              </View>
              <Text style={styles.remoteVideoText}>
                Видео недоступно
              </Text>
            </View>
          ) : (
            <View style={styles.connectingContainer}>
              <Text style={styles.connectingText}>Соединение...</Text>
            </View>
          )}
        </View>

        {/* Call Info Overlay */}
        <View style={styles.callInfoOverlay}>
          <Text style={styles.contactNameLarge}>{contactName}</Text>
          <Text style={styles.callStatus}>
            {isConnected ? formatDuration(callDuration) : 'Вызов...'}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          {/* Mute Button */}
          <Pressable
            style={[
              buttonStyles.muteButton,
              isMuted && styles.mutedButton
            ]}
            onPress={toggleMute}
          >
            <IconSymbol
              name={isMuted ? "mic.slash" : "mic"}
              size={24}
              color={isMuted ? colors.accent : colors.text}
            />
          </Pressable>

          {/* End Call Button */}
          <Pressable
            style={buttonStyles.endCallButton}
            onPress={endCall}
          >
            <IconSymbol name="phone.down" size={28} color="#FFFFFF" />
          </Pressable>

          {/* Video Toggle Button */}
          <Pressable
            style={[
              buttonStyles.muteButton,
              !isVideoEnabled && styles.mutedButton
            ]}
            onPress={toggleVideo}
          >
            <IconSymbol
              name={isVideoEnabled ? "video" : "video.slash"}
              size={24}
              color={!isVideoEnabled ? colors.accent : colors.text}
            />
          </Pressable>
        </View>

        <View style={styles.controlsRow}>
          {/* Switch Camera Button */}
          <Pressable
            style={buttonStyles.muteButton}
            onPress={switchCamera}
          >
            <IconSymbol name="arrow.triangle.2.circlepath.camera" size={24} color={colors.text} />
          </Pressable>

          {/* Speaker Button */}
          <Pressable
            style={buttonStyles.muteButton}
            onPress={() => console.log('Toggle speaker')}
          >
            <IconSymbol name="speaker.wave.2" size={24} color={colors.text} />
          </Pressable>

          {/* Chat Button */}
          <Pressable
            style={buttonStyles.muteButton}
            onPress={() => router.push(`/chat/${id}`)}
          >
            <IconSymbol name="message" size={24} color={colors.text} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  videoDisabled: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideo: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  remoteVideoContent: {
    alignItems: 'center',
  },
  remoteVideoText: {
    color: '#FFFFFF',
    fontSize: 10,
    marginTop: 8,
    textAlign: 'center',
  },
  connectingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectingText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  callInfoOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 160,
  },
  contactNameLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  callStatus: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  controlsContainer: {
    paddingHorizontal: 40,
    paddingVertical: 40,
    gap: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mutedButton: {
    backgroundColor: colors.accent,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLargeText: {
    fontSize: 60,
  },
  avatarMedium: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMediumText: {
    fontSize: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
