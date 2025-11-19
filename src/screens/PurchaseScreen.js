import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../context/WalletContext';

const packs = [
  { label: '50 💎', diamonds: 50, price: 299 },
  { label: '100 💎', diamonds: 100, price: 499 },
  { label: '200 💎', diamonds: 200, price: 899 },
  { label: '300 💎', diamonds: 300, price: 1299 },
  { label: '600 💎', diamonds: 600, price: 2299 },
];

export default function PurchaseScreen({ navigation }) {
  const { creditDiamonds } = useWallet();
  const [selected, setSelected] = useState(packs[0]);
  const [utr, setUtr] = useState('');
  const insets = useSafeAreaInsets();

  const verifyPayment = () => {
    if (!utr || utr.length < 8) {
      Alert.alert('Invalid UTR', 'Enter the UTR/Ref number from your payment.');
      return;
    }
    creditDiamonds(selected.diamonds);
    Alert.alert('Payment verified', `Added ${selected.diamonds} diamonds.`);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <LinearGradient colors={["#ef4770", "#7c3aed", "#1f2937"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingHorizontal: 16, paddingTop: insets.top + 12, paddingBottom: 12 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>Buy Diamonds</Text>
        <Text style={{ color: '#fff', opacity: 0.8, marginTop: 4 }}>Scan QR to pay, then enter UTR</Text>
      </LinearGradient>

      <View style={{ padding: 16 }}>
        <Image source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PAY_TO_YOUR_QR' }} style={{ width: 240, height: 240, alignSelf: 'center', marginVertical: 16 }} />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {packs.map((p) => (
            <Pressable
              key={p.diamonds}
              onPress={() => setSelected(p)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: selected.diamonds === p.diamonds ? '#e91e63' : '#333',
                backgroundColor: selected.diamonds === p.diamonds ? 'rgba(233,30,99,0.15)' : '#121212',
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>{p.label}</Text>
              <Text style={{ color: '#bbb' }}>₹{p.price}</Text>
            </Pressable>
          ))}
        </View>

        <TextInput value={utr} onChangeText={setUtr} placeholder="Enter UTR/Ref number" placeholderTextColor="#888" style={styles.input} />
        <Pressable onPress={verifyPayment} style={[styles.btnPrimary, { marginBottom: insets.bottom + 8 }]}>
          <Text style={styles.btnText}>Verify & Add Diamonds</Text>
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
    marginTop: 12,
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
  btnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
};