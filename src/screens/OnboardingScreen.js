import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';

export default function OnboardingScreen({ navigation }) {
  const { setGender } = useWallet();
  const insets = useSafeAreaInsets();

  const pick = (g) => {
    setGender(g);
    navigation.replace('Login');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://picsum.photos/seed/dekhoji/1200/800' }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'center', paddingTop: insets.top + 24, paddingHorizontal: 24, paddingBottom: 24 }}>
          <Text style={{ fontSize: 32, color: '#fff', fontWeight: '700', marginBottom: 16 }}>DekhoJi</Text>
          <Text style={{ fontSize: 16, color: '#fff', opacity: 0.9, marginBottom: 32 }}>
            Choose who you are to personalize your experience.
          </Text>
          <Pressable onPress={() => pick('boy')} style={styles.btnPrimary}>
            <Text style={styles.btnText}>I am a Boy</Text>
          </Pressable>
          <Pressable onPress={() => pick('girl')} style={styles.btnSecondary}>
            <Text style={styles.btnText}>I am a Girl</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = {
  btnPrimary: {
    backgroundColor: '#e91e63',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnSecondary: {
    backgroundColor: '#9c27b0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
};