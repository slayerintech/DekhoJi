import React, { useEffect, useState, useRef } from 'react';
import { Image, Pressable, Text, View, Animated, Easing } from 'react-native';
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

  const [messages, setMessages] = useState([{ id: '1', text: 'Hii ✨', icon: 'star' }]);
  const [callIncoming, setCallIncoming] = useState(false);
  const bannerY = useRef(new Animated.Value(-80)).current;
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isFocused) return;
    if (unreadMessages) setUnreadMessages(false);
    setMessages([{ id: '1', text: 'Hii ✨', icon: 'star' }]);
    setCallIncoming(false);
    const namePart = (profile?.name || '').split(' ')[0] || 'Baby';
    const timers = [];
    timers.push(setTimeout(() => setMessages((m) => [...m, { id: '2', text: `Hii handsome 😘`, icon: 'heart' }]), 1500));
    timers.push(setTimeout(() => setMessages((m) => [...m, { id: '3', text: `Want to see me, ${namePart}? 😉`, icon: 'eye' }]), 3200));
    timers.push(setTimeout(() => setMessages((m) => [...m, { id: '4', text: `Call me to watch my live 🎥`, icon: 'videocam' }]), 5000));
    timers.push(setTimeout(() => setCallIncoming(true), 5600));
    return () => { timers.forEach((t) => clearTimeout(t)); };
  }, [isFocused, idx]);

  useEffect(() => {
    if (callIncoming) {
      bannerY.setValue(-80);
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
          Animated.timing(iconScale, { toValue: 1.12, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a', paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>Messages</Text>
      </View>
      {callIncoming && (
        <Animated.View style={{ position: 'absolute', top: (insets.top || 0) + 8, left: 12, right: 12, transform: [{ translateY: bannerY }], opacity: bannerOpacity, zIndex: 50 }}>
          <Pressable onPress={() => navigation.navigate('Wallet')}>
            <LinearGradient colors={["#140014", "#19053a", "#cb00a2"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 18, paddingVertical: 14, paddingHorizontal: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={typeof profile.img === 'string' ? { uri: profile.img } : profile.img} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>Incoming Video Call</Text>
                  <Text style={{ color: '#FDE68A', fontSize: 13 }}>She is calling… Tap to connect</Text>
                </View>
                <Animated.View style={{ transform: [{ scale: iconScale }] }}>
                  <Ionicons name="videocam" size={36} color="#22c55e" />
                </Animated.View>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}

      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={typeof profile.img === 'string' ? { uri: profile.img } : profile.img} style={{ width: 72, height: 72, borderRadius: 36, marginRight: 14 }} />
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>{profile.name}</Text>
        </View>
        {messages.map((m) => (
          <View key={m.id} style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: 18 }}>
            <Image source={typeof profile.img === 'string' ? { uri: profile.img } : profile.img} style={{ width: 32, height: 32, borderRadius: 16, marginRight: 8 }} />
            <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, maxWidth: '82%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {m.icon ? <Ionicons name={m.icon} size={16} color="#FDE68A" style={{ marginRight: 6 }} /> : null}
                <Text style={{ color: '#fff', fontSize: 15 }}>{m.text}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ position: 'absolute', left: 16, right: 16, bottom: insets.bottom }}>
        <Pressable onPress={() => navigation.navigate('LiveWatch', { profile })} style={{ backgroundColor: '#e11d48', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="videocam" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>Video Call</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
