import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWallet } from '../context/WalletContext';

export default function GoLiveScreen({ navigation }) {
  const { user, setLiveRooms } = useWallet();
  const [title, setTitle] = useState('Just chatting');
  const [isLive, setIsLive] = useState(false);
  const insets = useSafeAreaInsets();

  const startLive = () => {
    setIsLive(true);
    setLiveRooms((r) => [
      ...r,
      {
        id: Date.now().toString(),
        name: user?.name || 'Host',
        img: 'https://picsum.photos/seed/host/1080/720',
        live: true,
      },
    ]);
    Alert.alert('Live started', 'Viewers can now connect.');
  };

  const stopLive = () => {
    setIsLive(false);
    Alert.alert('Live stopped', 'Your stream has ended.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 24, paddingBottom: 24 }}>
        <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 12 }}>Go Live</Text>
        <Text style={{ color: '#bbb', marginBottom: 8 }}>Title</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Live title" placeholderTextColor="#888" />
        {!isLive ? (
          <Pressable onPress={startLive} style={styles.btnPrimary}>
            <Text style={styles.btnText}>Start Live</Text>
          </Pressable>
        ) : (
          <Pressable onPress={stopLive} style={styles.btnSecondary}>
            <Text style={styles.btnText}>Stop Live</Text>
          </Pressable>
        )}
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
  btnSecondary: {
    backgroundColor: '#9c27b0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
};