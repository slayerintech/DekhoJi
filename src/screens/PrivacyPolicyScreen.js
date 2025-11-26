import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Pressable, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

const POLICY_URL = 'https://slayerintech.github.io/DekhoJi/privacy-policy.html';

export default function PrivacyPolicyScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const openPolicy = async () => {
    try {
      const result = await WebBrowser.openBrowserAsync(POLICY_URL);
      if (result?.type === 'cancel' || result?.type === 'dismiss') {
        // user closed; nothing else
      }
    } catch (e) {
      try {
        await Linking.openURL(POLICY_URL);
      } catch {
        Alert.alert('Unable to open', 'Please copy and open this link in your browser:\n' + POLICY_URL);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, paddingBottom: 12 }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>Privacy Policy</Text>
        <Text style={{ color: '#bbb', marginTop: 8 }}>Read DekhoJi’s privacy practices at the official page.</Text>
      </View>

      <View style={{ paddingHorizontal: 24 }}>
        <Pressable onPress={openPolicy}>
          <LinearGradient colors={['#0ea5e9', '#22c55e']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ borderRadius: 14, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
            <Ionicons name="shield-checkmark" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>Open Privacy Policy</Text>
          </LinearGradient>
        </Pressable>

        <View style={{ marginTop: 18, backgroundColor: '#1c1c1c', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#333' }}>
          <Text style={{ color: '#9ca3af', fontSize: 13 }}>Link:</Text>
          <Text selectable style={{ color: '#60a5fa', marginTop: 4 }}>{POLICY_URL}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
