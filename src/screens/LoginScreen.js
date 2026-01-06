import React from 'react';
import {
  Alert,
  ImageBackground,
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function LoginScreen({ navigation }) {
  const { setUser } = useWallet();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [mode, setMode] = React.useState('login');
  // React.useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: '1014858874602-cm9o4k5jten01ftdutmfu0c43rorqrt5.apps.googleusercontent.com',
  //   });
  // }, []);

  const continueGoogle = async () => {
    Alert.alert('Google Login', 'Google login is currently disabled.');
    // try {
    //   await GoogleSignin.hasPlayServices();
    //   const response = await GoogleSignin.signIn();
    //   if (response && response.data && response.data.idToken) {
    //     const idToken = response.data.idToken;
    //     const credential = GoogleAuthProvider.credential(idToken);
    //     const cred = await signInWithCredential(auth, credential);
    //     const u = cred.user;
    //     setUser({ id: u.uid, name: u.displayName || 'User', email: u.email || '', avatar: u.photoURL || '', method: 'google' });
    //     navigation.replace('Home');
    //   }
    // } catch (error) {
    //   if (error.code === 'SIGN_IN_CANCELLED') {
    //     // cancelled
    //   } else if (error.code === 'IN_PROGRESS') {
    //     // in progress
    //   } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
    //     Alert.alert('Google Login', 'Play services not available');
    //   } else {
    //     Alert.alert('Google Login', 'Login failed. Try again.');
    //     console.error(error);
    //   }
    // }
  };

  const continueEmail = async () => {
    const em = email.trim();
    const pw = password;
    const okEmail = /.+@.+\..+/.test(em);
    if (!okEmail) { Alert.alert('Email Login', 'Enter a valid email.'); return; }
    if (!pw || pw.length < 6) { Alert.alert('Email Login', 'Password must be at least 6 characters.'); return; }
    if (mode === 'login') {
      try {
        const cred = await signInWithEmailAndPassword(auth, em, pw);
        const u = cred.user;
        setUser({ id: u.uid, name: u.displayName || 'User', email: u.email || '', avatar: u.photoURL || '', method: 'email' });
        navigation.replace('Home');
      } catch (err) {
        const code = err?.code || '';
        if (code === 'auth/user-not-found') {
          Alert.alert('Email Login', 'No account found with this email. Sign up first.');
        } else if (code === 'auth/wrong-password') {
          Alert.alert('Email Login', 'Incorrect password. Try again.');
        } else if (code === 'auth/invalid-email') {
          Alert.alert('Email Login', 'Invalid email address.');
        } else if (code === 'auth/network-request-failed') {
          Alert.alert('Email Login', 'Network error. Check Firebase config and internet.');
        } else {
          Alert.alert('Email Login', 'Unable to login. Try again later.');
        }
      }
      return;
    }
    if (!confirmPassword || confirmPassword.length < 6) {
      Alert.alert('Sign Up', 'Confirm password must be at least 6 characters.');
      return;
    }
    if (confirmPassword !== pw) {
      Alert.alert('Sign Up', 'Password and confirm password do not match.');
      return;
    }
    try {
      const credNew = await createUserWithEmailAndPassword(auth, em, pw);
      const u = credNew.user;
      setUser({ id: u.uid, name: u.displayName || 'User', email: u.email || '', avatar: u.photoURL || '', method: 'email' });
      navigation.replace('Home');
    } catch (err) {
      try {
        const code = err?.code || '';
        if (code === 'auth/email-already-in-use') {
          Alert.alert('Sign Up', 'Email already exists. Try logging in instead.');
        } else if (code === 'auth/invalid-email') {
          Alert.alert('Sign Up', 'Invalid email address.');
        } else if (code === 'auth/weak-password') {
          Alert.alert('Sign Up', 'Weak password. Use at least 6 characters.');
        } else if (code === 'auth/network-request-failed') {
          Alert.alert('Sign Up', 'Network error. Check Firebase config and internet.');
        } else {
          Alert.alert('Sign Up', 'Unable to create account.');
        }
      } catch (e) {
        Alert.alert('Sign Up', 'Unable to create account.');
      }
    }
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
              <View style={styles.tabRow}>
                <Pressable
                  onPress={() => setMode('login')}
                  style={[styles.tabButton, mode === 'login' && styles.tabButtonActive]}
                >
                  <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Login</Text>
                </Pressable>
                <Pressable
                  onPress={() => setMode('signup')}
                  style={[styles.tabButton, mode === 'signup' && styles.tabButtonActive]}
                >
                  <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>Sign up</Text>
                </Pressable>
              </View>
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
                placeholder={mode === 'login' ? 'Password' : 'Create password'}
                placeholderTextColor="#888"
                secureTextEntry
                style={styles.input}
              />
              {mode === 'signup' && (
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor="#888"
                  secureTextEntry
                  style={styles.input}
                />
              )}
              <Pressable
                onPress={continueEmail}
                style={({ pressed }) => [styles.btnGoogle, pressed && styles.pressed]}
              >
                <Ionicons name="mail" size={20} color="#fff" style={{ marginRight: 12 }} />
                <Text style={styles.btnText}>{mode === 'login' ? 'Login with Email' : 'Sign up with Email'}</Text>
              </Pressable>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                onPress={continueGoogle}
                style={({ pressed }) => [styles.btnGoogleAlt, pressed && styles.pressed]}
              >
                <Ionicons name="logo-google" size={20} color="#111" style={{ marginRight: 12 }} />
                <Text style={styles.btnTextAlt}>{mode === 'login' ? 'Login with Google' : 'Sign up with Google'}</Text>
              </Pressable>

              <Text style={styles.switchText}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <Text
                  style={styles.switchLink}
                  onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
                >
                  {mode === 'login' ? 'Sign up' : 'Login'}
                </Text>
              </Text>

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
  tabRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: '#ff2fb0',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#fff',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginHorizontal: 8,
  },
  btnGoogleAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 12,
  },
  btnTextAlt: { color: '#111', fontSize: 16, fontWeight: '700' },
  switchText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  switchLink: {
    color: '#ff2fb0',
    fontWeight: '700',
  },
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
