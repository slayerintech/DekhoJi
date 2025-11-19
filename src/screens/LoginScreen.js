import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';

export default function LoginScreen({ navigation }) {
  const { gender, setUser } = useWallet();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const insets = useSafeAreaInsets();

  const continueGoogle = () => {
    Alert.alert('Google Sign-In', 'Configure Google OAuth to enable this. Using mock login.');
    setUser({ name: 'Google User', method: 'google' });
    goNext();
  };

  const loginBasic = () => {
    if (!username || !password) {
      Alert.alert('Missing info', 'Please enter username and password.');
      return;
    }
    setUser({ name: username, method: 'password' });
    goNext();
  };

  const goNext = () => {
    if (gender === 'girl') navigation.replace('GoLive');
    else navigation.replace('Home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, paddingBottom: 24 }}>
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 8 }}>Welcome</Text>
        <Text style={{ color: '#bbb', marginBottom: 24 }}>Sign in to continue</Text>

        <Pressable onPress={continueGoogle} style={styles.btnGoogle}>
          <Text style={styles.btnText}>Continue with Google</Text>
        </Pressable>

        <View style={{ height: 16 }} />

        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Username"
          placeholderTextColor="#888"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          placeholderTextColor="#888"
          style={styles.input}
        />

        <Pressable onPress={loginBasic} style={styles.btnPrimary}>
          <Text style={styles.btnText}>Sign in</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  input: {
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  btnPrimary: {
    backgroundColor: '#e91e63',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  btnGoogle: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
};