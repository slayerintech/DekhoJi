import React, { useState } from 'react';
import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AgeGateScreen({ navigation }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <LinearGradient colors={["#ef4770", "#7c3aed", "#1f2937"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 32, fontWeight: '800' }}>DekhoJi</Text>
        <Text style={{ color: '#fff', marginTop: 8, opacity: 0.9 }}>18+ adult live video chat experience</Text>
      </LinearGradient>
      <View style={{ padding: 24, flex: 1, justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Age Confirmation</Text>
        <Text style={{ color: '#bbb', marginBottom: 20 }}>
          You must be at least 18 years old to use this app. By continuing you confirm you are 18+ and agree to the 
          <Text style={{ color: '#e91e63', fontWeight: 'bold' }} onPress={() => navigation.navigate('Terms')}> Terms </Text>
          and 
          <Text style={{ color: '#e91e63', fontWeight: 'bold' }} onPress={() => navigation.navigate('Privacy')}> Privacy Policy</Text>.
        </Text>
        <Pressable onPress={() => setAccepted((v) => !v)} style={{ backgroundColor: accepted ? '#22c55e' : '#1c1c1c', borderColor: accepted ? '#22c55e' : '#333', borderWidth: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>{accepted ? 'I confirm I am 18+' : 'Tap to confirm 18+'}</Text>
        </Pressable>
        <Pressable disabled={!accepted} onPress={() => navigation.replace('Onboarding')} style={{ backgroundColor: accepted ? '#e91e63' : '#2a2a2a', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>{accepted ? 'Continue' : 'Confirm age to continue'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}