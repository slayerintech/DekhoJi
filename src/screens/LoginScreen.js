// LoginScreen.js
import React from 'react';
import {
  Alert,
  ImageBackground,
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';

export default function LoginScreen({ navigation }) {
  const { setUser } = useWallet();
  const insets = useSafeAreaInsets();

  const continueGoogle = () => {
    Alert.alert('Google Sign-In', 'Configure Google OAuth to enable this. Using mock login.');
    setUser({ name: 'Google User', method: 'google' });
    navigation.replace('Home');
  };

  const continueFacebook = () => {
    Alert.alert('Facebook Sign-In', 'Configure Facebook OAuth to enable this. Using mock login.');
    setUser({ name: 'Facebook User', method: 'facebook' });
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/login-bg.png')}
        style={styles.bg}
        imageStyle={styles.bgImage}
        resizeMode="cover"
      >
        {/* slight blur for legibility */}
        <BlurView intensity={20} tint="dark" style={styles.blur}>
          <LinearGradient
            colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.6)']}
            style={[styles.gradient, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 20 }]}
          >
            {/* central content */}
            <View style={styles.centerWrap}>
              {/* circular logo similar to screenshot */}
              <View style={styles.logoBox}>
                <Image source={require('../../assets/SymbolImage.jpg')} style={styles.logoImage} resizeMode="cover" />
              </View>

              <Text style={styles.title}>Welcome to Bunny</Text>
              <Text style={styles.subtitle}>The biggest live streaming platform.</Text>

              <View style={styles.card}>
                <BlurView intensity={30} tint="light" style={styles.cardBlur} />
                <Pressable
                  onPress={continueGoogle}
                  style={({ pressed }) => [styles.btnGoogle, pressed && styles.pressed]}
                >
                  <Ionicons name="logo-google" size={20} color="#fff" style={{ marginRight: 12 }} />
                  <Text style={styles.btnText}>Login with Google</Text>
                </Pressable>

                <Pressable
                  onPress={continueFacebook}
                  style={({ pressed }) => [styles.btnFb, pressed && styles.pressed]}
                >
                  <FontAwesome name="facebook" size={20} color="#fff" style={{ marginRight: 12 }} />
                  <Text style={styles.btnText}>Continue with Facebook</Text>
                </Pressable>

                <Text style={styles.terms}>
                  By continuing you agree to our <Text style={styles.link} onPress={() => navigation.navigate('Terms')}>Terms and Conditions</Text>
                </Text>
              </View>

              
            </View>
          </LinearGradient>
        </BlurView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  bg: { flex: 1, width: '100%', height: '100%' },
  bgImage: { transform: [{ scale: 1.2 }] },
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
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
    position: 'relative',
  },

  btnGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff2fb0',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 12,
  },

  btnFb: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1877F2',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
  },
  cardBlur: { ...StyleSheet.absoluteFillObject },

  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.86 },

  terms: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 14,
    textAlign: 'center',
  },
  link: { color: 'rgba(255,255,255,0.9)', textDecorationLine: 'underline' },

  registerRow: { flexDirection: 'row', marginTop: 18 },
  newHere: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  registerLink: { color: '#ff2fb0', fontSize: 13, fontWeight: '700' },
});
