import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Modal, StyleSheet, Pressable, Animated, Easing, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useCall } from '../context/CallContext';
import { useWallet } from '../context/WalletContext';

const Pulse = ({ delay }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        })
      )
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.pulseRing,
        {
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 2.2],
              }),
            },
          ],
          opacity: anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.5, 0.2, 0],
          }),
        },
      ]}
    />
  );
};

export default function GlobalCallUI() {
  const { isCallActive, callerInfo, endCall } = useCall();
  const { setShowDiamondSheet } = useWallet();
  
  const iconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCallActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconScale, { toValue: 1.15, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(iconScale, { toValue: 1.0, duration: 600, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    } else {
      iconScale.setValue(1);
    }
  }, [isCallActive]);

  const handleDecline = () => {
    endCall('missed');
  };

  const handleAccept = () => {
    endCall('accepted');
    setShowDiamondSheet(true);
  };
  
  if (!isCallActive) return null;

  return (
    <Modal visible={isCallActive} transparent={false} animationType="slide" onRequestClose={handleDecline}>
      <View style={styles.fullScreenCallContainer}>
        {/* Background */}
        <ImageBackground 
          source={callerInfo?.image && (typeof callerInfo.image === 'string' ? { uri: callerInfo.image } : callerInfo.image)} 
          style={StyleSheet.absoluteFill}
          blurRadius={30}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={StyleSheet.absoluteFill}
          />
        </ImageBackground>

        <View style={styles.callerInfo}>
          <View style={styles.avatarContainer}>
             <Pulse delay={0} />
             <Pulse delay={600} />
             <Pulse delay={1200} />
             <Animated.View style={[styles.avatarRing, { transform: [{ scale: iconScale }] }]}>
                <Image 
                  source={callerInfo?.image && (typeof callerInfo.image === 'string' ? { uri: callerInfo.image } : callerInfo.image)} 
                  style={styles.callerAvatar} 
                />
             </Animated.View>
          </View>
          <Text style={styles.callerName}>{callerInfo?.name}</Text>
          <Text style={styles.callerStatus}>{callerInfo?.status}</Text>
        </View>

        <View style={styles.callActions}>
          {/* Decline Button */}
          <View style={styles.actionBtnWrapper}>
            <Pressable 
              onPress={handleDecline} 
              style={[styles.actionBtn, { backgroundColor: '#FF3B30' }]}
            >
              <Ionicons name="call" size={32} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
            </Pressable>
            <Text style={styles.actionText}>Decline</Text>
          </View>

          {/* Accept Button */}
          <View style={styles.actionBtnWrapper}>
            <Animated.View style={{ transform: [{ scale: iconScale }] }}>
              <Pressable 
                onPress={handleAccept} 
                style={[styles.actionBtn, { backgroundColor: '#34C759' }]}
              >
                <Ionicons name="videocam" size={32} color="#fff" />
              </Pressable>
            </Animated.View>
            <Text style={styles.actionText}>Accept</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fullScreenCallContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 120,
    paddingBottom: 80,
  },
  callerInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: 200,
    height: 200,
  },
  pulseRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 82, 159, 0.5)', // App Theme Color (Pink)
  },
  avatarRing: {
    padding: 4,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)', // Increased opacity for better visibility
    backgroundColor: 'rgba(0,0,0,0.2)', // Slight dark bg behind avatar
  },
  callerAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  callerName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  callerStatus: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    letterSpacing: 1,
  },
  callActions: {
    flexDirection: 'row',
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  actionBtnWrapper: {
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
