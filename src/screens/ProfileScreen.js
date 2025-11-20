import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { gender, setGender, user } = useWallet();

  const select = (g) => setGender(g);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, paddingBottom: 24 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>Profile</Text>
        <Text style={{ color: '#bbb', marginTop: 8 }}>{user?.name || 'Guest'}</Text>

        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginTop: 24 }}>Who are you?</Text>
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          <Pressable onPress={() => select('boy')} style={{ backgroundColor: gender === 'boy' ? '#e91e63' : '#1c1c1c', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginRight: 8 }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Boy</Text>
          </Pressable>
          <Pressable onPress={() => select('girl')} style={{ backgroundColor: gender === 'girl' ? '#e91e63' : '#1c1c1c', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12 }}>
            <Text style={{ color: '#fff', fontWeight: '600' }}>Girl</Text>
          </Pressable>
        </View>

        {gender === 'girl' && (
          <Pressable onPress={() => navigation.navigate('GoLive')} style={{ backgroundColor: '#9c27b0', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Go Live</Text>
          </Pressable>
        )}

        <Pressable style={{ backgroundColor: '#e91e63', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 24 }}>
          <Text style={{ color: '#fff' }}>Edit Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}