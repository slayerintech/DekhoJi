import React from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';

export default function WelcomeScreen({ navigation }) {
  const { setUser } = useWallet();
  const insets = useSafeAreaInsets();

  const handleGuestLogin = () => {
    setUser({
      id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: 'guest@dekhoji.com',
      avatar: 'https://i.pravatar.cc/300',
      isGuest: true,
    });
    // Navigation to Home is handled automatically by App.js when user is set
  };

  const handleOtherLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Background Image Absolute Positioned */}
      <Image
        source={require('../../assets/login-bg.png')}
        style={styles.absoluteBg}
        resizeMode="cover"
      />

      {/* Content Overlay */}
      <BlurView intensity={20} tint="dark" style={styles.blur}>
        <LinearGradient
          colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.6)']}
          style={[styles.gradient, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
          {/* central content */}
          <View style={styles.centerWrap}>
            {/* circular logo similar to screenshot */}
            <View style={styles.logoBox}>
              <Image source={require('../../assets/SymbolImage.jpg')} style={styles.logoImage} resizeMode="cover" />
            </View>

            <Text style={styles.title}>Welcome to DekhoJi</Text>
            <Text style={styles.subtitle}>The biggest live streaming platform.</Text>

            <View style={styles.card}>
              <BlurView intensity={30} tint="light" style={styles.cardBlur} />
              
              <Pressable
                onPress={handleGuestLogin}
                style={({ pressed }) => [styles.btnPrimary, pressed && styles.pressed]}
              >
                <Ionicons name="person" size={20} color="#fff" style={{ marginRight: 12 }} />
                <Text style={styles.btnText}>1 Tap Login (Guest)</Text>
              </Pressable>

              <Pressable
                onPress={handleOtherLogin}
                style={({ pressed }) => [styles.btnSecondary, pressed && styles.pressed]}
              >
                <Ionicons name="log-in-outline" size={20} color="#111" style={{ marginRight: 12 }} />
                <Text style={styles.btnTextSecondary}>Other Login Options</Text>
              </Pressable>

              <Text style={styles.terms}>
                By continuing you agree to our <Text style={styles.link} onPress={() => navigation.navigate('Terms')}>Terms and Conditions</Text>
              </Text>
            </View>
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  absoluteBg: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    transform: [{ scale: 1.6 }] 
  },
  blur: { flex: 1 },
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  centerWrap: {
    alignItems: 'center',
    width: '100%',
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  logoImage: { width: '100%', height: '100%', borderRadius: 28 },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginBottom: 18,
  },
  card: {
    width: '92%',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
    position: 'relative',
  },
  cardBlur: { ...StyleSheet.absoluteFillObject },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff2fb0',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 16,
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 16,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnTextSecondary: { color: '#111', fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.86 },
  terms: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
  },
  link: { color: 'rgba(255,255,255,0.9)', textDecorationLine: 'underline' },
});
