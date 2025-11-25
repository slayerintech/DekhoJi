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
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { NativeModules, Platform } from 'react-native';
import { useWallet } from '../context/WalletContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function LoginScreen({ navigation }) {
  const { setUser } = useWallet();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  React.useEffect(() => {}, []);

  const continueGoogle = async () => {};

  const continueEmail = async () => {
    const em = email.trim();
    const pw = password;
    const okEmail = /.+@.+\..+/.test(em);
    if (!okEmail) { Alert.alert('Email Login', 'Enter a valid email.'); return; }
    if (!pw || pw.length < 6) { Alert.alert('Email Login', 'Password must be at least 6 characters.'); return; }
    try {
      const cred = await signInWithEmailAndPassword(auth, em, pw);
      const u = cred.user;
      setUser({ id: u.uid, name: u.displayName || 'User', email: u.email || '', avatar: u.photoURL || '', method: 'email' });
      navigation.replace('Home');
    } catch (e) {
      try {
        const credNew = await createUserWithEmailAndPassword(auth, em, pw);
        const u = credNew.user;
        setUser({ id: u.uid, name: u.displayName || 'User', email: u.email || '', avatar: u.photoURL || '', method: 'email' });
        navigation.replace('Home');
      } catch (err) {
        const code = err?.code || '';
        if (code === 'auth/email-already-in-use') {
          Alert.alert('Email Login', 'Email already exists. Check your password.');
        } else if (code === 'auth/invalid-email') {
          Alert.alert('Email Login', 'Invalid email address.');
        } else if (code === 'auth/weak-password') {
          Alert.alert('Email Login', 'Weak password. Use at least 6 characters.');
        } else if (code === 'auth/network-request-failed') {
          Alert.alert('Email Login', 'Network error. Check Firebase config and internet.');
        } else {
          Alert.alert('Email Login', 'Unable to login or register.');
        }
      }
    }
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
            style={[styles.gradient, { paddingTop: insets.top - 62, paddingBottom: insets.bottom + 52 }]}
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
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  secureTextEntry
                  style={styles.input}
                />
                <Pressable
                  onPress={continueEmail}
                  style={({ pressed }) => [styles.btnGoogle, pressed && styles.pressed]}
                >
                  <Ionicons name="mail" size={20} color="#fff" style={{ marginRight: 12 }} />
                  <Text style={styles.btnText}>Continue with Email</Text>
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
  input: {
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    width: '100%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
});
