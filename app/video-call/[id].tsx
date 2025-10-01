
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
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function VideoCallScreen() {
  const { id } = useLocalSearchParams();
  const [contactName, setContactName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('front');
  const [callDuration, setCallDuration] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    loadContactName();
    
    // Simulate call connection after 2 seconds
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.log('Haptics error:', error);
      }
    }, 2000);

    return () => {
      clearTimeout(connectTimer);
    };
  }, []);

  useEffect(() => {
    let durationTimer: NodeJS.Timeout;
    if (isConnected) {
      durationTimer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (durationTimer) clearInterval(durationTimer);
    };
  }, [isConnected]);

  const loadContactName = () => {
    try {
      // Map contact names based on ID
      const contactNames: { [key: string]: string } = {
        '1': 'Ada Miles',
        '2': 'William Hayes', 
        '3': 'Grace Brooks',
        '4': 'Anna Giovanni',
        '5': 'Emma Barnes',
        '6': 'Benjamin Cruz',
      };
      setContactName(contactNames[id as string] || 'Unknown Contact');
    } catch (error) {
      console.log('Error loading contact name:', error);
      setContactName('Unknown Contact');
    }
  };

  const toggleMute = () => {
    try {
      setIsMuted(!isMuted);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Error toggling mute:', error);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    try {
      setIsVideoEnabled(!isVideoEnabled);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Error toggling video:', error);
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const switchCamera = () => {
    try {
      setCameraType(cameraType === 'back' ? 'front' : 'back');
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Error switching camera:', error);
      setCameraType(cameraType === 'back' ? 'front' : 'back');
    }
  };

  const endCall = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.log('Haptics error:', error);
    }
    router.back();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.statusText}>Requesting permissions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.statusText}>No access to camera</Text>
          <Text style={styles.subtitleText}>
            Camera permission is required for video calls
          </Text>
          <Pressable style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </Pressable>
          <Pressable style={[styles.button, { backgroundColor: colors.backgroundAlt, marginTop: 16 }]} onPress={() => router.back()}>
            <Text style={[styles.buttonText, { color: colors.text }]}>Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main Video Area - Full Screen */}
      <View style={styles.mainVideoContainer}>
        {/* Remote user's video (simulated with avatar) */}
        <View style={styles.remoteVideoFull}>
          <View style={styles.remoteUserAvatar}>
            <Text style={styles.remoteUserAvatarText}>👩‍💼</Text>
          </View>
        </View>

        {/* Header with contact name and back button */}
        <View style={styles.headerOverlay}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.contactNameHeader}>{contactName}</Text>
            <Text style={styles.callStatusHeader}>
              {isConnected ? formatDuration(callDuration) : 'Connecting...'}
            </Text>
          </View>
        </View>

        {/* Picture-in-Picture - User's own video */}
        <View style={styles.pipContainer}>
          {isVideoEnabled ? (
            <CameraView
              style={styles.pipVideo}
              facing={cameraType}
            />
          ) : (
            <View style={styles.pipVideoDisabled}>
              <IconSymbol name="video.slash" size={24} color="#FFFFFF" />
            </View>
          )}
        </View>
      </View>

      {/* Bottom Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlsRow}>
          {/* Mute/Unmute */}
          <Pressable
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={toggleMute}
          >
            <IconSymbol
              name={isMuted ? "mic.slash" : "mic"}
              size={24}
              color={isMuted ? "#FFFFFF" : "#8E8E93"}
            />
          </Pressable>

          {/* Switch Camera */}
          <Pressable
            style={styles.controlButton}
            onPress={switchCamera}
          >
            <IconSymbol name="arrow.triangle.2.circlepath.camera" size={24} color="#8E8E93" />
          </Pressable>

          {/* Video On/Off */}
          <Pressable
            style={[styles.controlButton, !isVideoEnabled && styles.controlButtonActive]}
            onPress={toggleVideo}
          >
            <IconSymbol
              name={isVideoEnabled ? "video" : "video.slash"}
              size={24}
              color={!isVideoEnabled ? "#FFFFFF" : "#8E8E93"}
            />
          </Pressable>

          {/* End Call */}
          <Pressable
            style={styles.endCallButton}
            onPress={endCall}
          >
            <IconSymbol name="phone.down" size={28} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mainVideoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideoFull: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteUserAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteUserAvatarText: {
    fontSize: 60,
  },
  headerOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  contactNameHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  callStatusHeader: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  pipContainer: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    width: 100,
    height: 140,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pipVideo: {
    flex: 1,
  },
  pipVideoDisabled: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    paddingHorizontal: 40,
    paddingVertical: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: colors.accent,
  },
  endCallButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitleText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
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
