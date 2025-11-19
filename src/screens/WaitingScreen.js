import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WaitingScreen() {
  const [message, setMessage] = useState('Connecting to a live host...');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const t = setTimeout(() => {
      setMessage('No girl is live right now. Please try again at night.');
    }, 90000);
    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', paddingTop: insets.top }}>
      <View style={{ padding: 24 }}>
        <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}