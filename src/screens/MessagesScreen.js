import React, { useEffect, useState, useRef } from 'react';
import { Image, Pressable, Text, View, Animated, Easing, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

export default function MessagesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { liveRooms, unreadMessages, setUnreadMessages } = useWallet();
  const isFocused = useIsFocused();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (isFocused) {
      setIdx((i) => (i + 1) % (liveRooms?.length || 1));
    } else {
      setUnreadMessages(true);
    }
  }, [isFocused]);

  const profile = (liveRooms && liveRooms.length > 0 && liveRooms[idx])
    ? liveRooms[idx]
    : { id: '1', name: 'Priya Sharma', img: require('../../assets/img1.jpeg'), live: true, viewers: 2500 };

  const [messages, setMessages] = useState([{ id: '1', text: 'Hii ✨', icon: 'star', time: 'Just now' }]);
  const [callIncoming, setCallIncoming] = useState(false);
  const bannerY = useRef(new Animated.Value(-100)).current;
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  const startCallScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(startCallScale, {
          toValue: 1.05,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(startCallScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!isFocused) return;
    if (unreadMessages) setUnreadMessages(false);
    
    setMessages([{ id: '1', text: 'Hii ✨', icon: 'star', time: 'Just now' }]);
    setCallIncoming(false);
    
    const namePart = (profile?.name || '').split(' ')[0] || 'Baby';
    const timers = [];
    
    timers.push(setTimeout(() => setMessages((m) => [...m, { id: '2', text: `Hii handsome 😘`, icon: 'heart', time: 'Just now' }]), 1500));
    timers.push(setTimeout(() => setMessages((m) => [...m, { id: '3', text: `Want to see me, ${namePart}? 😉`, icon: 'eye', time: 'Just now' }]), 3200));
    timers.push(setTimeout(() => setMessages((m) => [...m, { id: '4', text: `Call me to watch my live 🎥`, icon: 'videocam', time: 'Just now' }]), 5000));
    timers.push(setTimeout(() => setCallIncoming(true), 5600));
    
    return () => { timers.forEach((t) => clearTimeout(t)); };
  }, [isFocused, idx]);

  useEffect(() => {
    if (callIncoming) {
      bannerY.setValue(-100);
      bannerOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(bannerY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bannerOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(iconScale, { toValue: 1.15, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(iconScale, { toValue: 1.0, duration: 600, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [callIncoming]);

  useEffect(() => {
    if (callIncoming) {
      const hide = setTimeout(() => setCallIncoming(false), 20000);
      return () => clearTimeout(hide);
    }
  }, [callIncoming]);

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Incoming Call Banner */}
      {callIncoming && (
        <Animated.View style={[styles.bannerContainer, { top: insets.top + 10, transform: [{ translateY: bannerY }], opacity: bannerOpacity }]}>
          <Pressable onPress={() => navigation.navigate('Purchase', { from: 'Messages' })}>
            <LinearGradient 
                colors={["#1f1f1f", "#2d1f2d", "#4a042e"]} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }} 
                style={styles.bannerGradient}
            >
              <View style={styles.bannerContent}>
                <Image source={typeof profile.img === 'string' ? { uri: profile.img } : profile.img} style={styles.bannerAvatar} />
                <View style={styles.bannerTextContainer}>
                  <Text style={styles.bannerTitle}>Incoming Video Call</Text>
                  <Text style={styles.bannerSubtitle}>Tap to connect now...</Text>
                </View>
                <Animated.View style={[styles.callIconContainer, { transform: [{ scale: iconScale }] }]}>
                  <Ionicons name="videocam" size={24} color="#fff" />
                </Animated.View>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}

      {/* Chat Area */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Header in Chat */}
        <View style={styles.chatHeader}>
          <View style={styles.avatarContainer}>
             <Image source={typeof profile.img === 'string' ? { uri: profile.img } : profile.img} style={styles.chatAvatar} />
             <View style={styles.onlineBadge} />
          </View>
          <Text style={styles.chatName}>{profile.name}</Text>
          <Text style={styles.chatStatus}>Online now</Text>
        </View>
        
        <View style={styles.divider} />

        {/* Messages List */}
        <View style={styles.messagesList}>
            {messages.map((m) => (
            <View key={m.id} style={styles.messageRow}>
                <Image source={typeof profile.img === 'string' ? { uri: profile.img } : profile.img} style={styles.msgAvatar} />
                <View>
                    <View style={styles.bubble}>
                        <Text style={styles.bubbleText}>{m.text}</Text>
                    </View>
                </View>
            </View>
            ))}
        </View>

      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
        <Animated.View style={{ transform: [{ scale: startCallScale }] }}>
          <Pressable onPress={() => navigation.navigate('Purchase', { from: 'Messages' })} style={styles.videoCallBtn}>
            <LinearGradient
              colors={['#22c55e', '#16a34a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              <Ionicons name="videocam" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.btnText}>Start Video Call</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  
  bannerContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
    shadowColor: "#ff529f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bannerGradient: { borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 82, 159, 0.3)' },
  bannerContent: { flexDirection: 'row', alignItems: 'center' },
  bannerAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, borderWidth: 2, borderColor: '#ff529f' },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  bannerSubtitle: { color: '#ff529f', fontSize: 12, fontWeight: '600' },
  callIconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' },

  scrollContent: { paddingBottom: 100 },
  chatHeader: { alignItems: 'center', paddingVertical: 24 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  chatAvatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#1a1a1a' },
  onlineBadge: { 
    position: 'absolute', 
    bottom: 4, 
    right: 4, 
    width: 16, 
    height: 16, 
    borderRadius: 8, 
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#000'
  },
  chatName: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  chatStatus: { color: '#888', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#1a1a1a', width: '100%', marginBottom: 20 },

  messagesList: { paddingHorizontal: 16, paddingTop: 20 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  msgAvatar: { width: 30, height: 30, borderRadius: 15, marginRight: 10, marginBottom: 4 },
  bubble: { 
    backgroundColor: '#262626', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 22, 
    maxWidth: '75%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubbleText: { color: '#fff', fontSize: 15, lineHeight: 22, fontWeight: '400' },
  timestamp: { display: 'none' }, // Instagram hides timestamps by default usually, or we can make it very subtle

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    padding: 16,
  },
  videoCallBtn: { borderRadius: 14, overflow: 'hidden' },
  gradientBtn: { 
    paddingVertical: 16, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 }
});
