import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, paddingBottom: 24 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>Profile</Text>
        <Pressable style={{ backgroundColor: '#e91e63', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: '#fff' }}>Edit Profile</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}