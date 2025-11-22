import React, { useState } from 'react';
import { Alert, ImageBackground, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';

export default function LoginScreen({ navigation }) {
  const { gender, setUser } = useWallet();
  const insets = useSafeAreaInsets();

  const continueGoogle = () => {
    Alert.alert('Google Sign-In', 'Configure Google OAuth to enable this. Using mock login.');
    setUser({ name: 'Google User', method: 'google' });
    goNext();
  };

  const goNext = () => {
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <ImageBackground
        source={{ uri: 'https://loremflickr.com/1080/1920/indian,model,girl?lock=27' }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(10,10,10,0.9)"]}
          style={{ flex: 1, paddingTop: insets.top, paddingHorizontal: 24, paddingBottom: insets.bottom, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={{ color: '#fff', fontSize: 34, fontWeight: '800', textAlign: 'center', marginBottom: 12 }}>DekhoJi</Text>
          <Text style={{ color: '#ddd', textAlign: 'center', marginBottom: 24, fontSize: 16 }}>Find live connections instantly</Text>

          <Pressable onPress={continueGoogle} style={styles.btnGoogle}>
            <Ionicons name="logo-google" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>Continue with Google</Text>
          </Pressable>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = {
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
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    minWidth: 240,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
};