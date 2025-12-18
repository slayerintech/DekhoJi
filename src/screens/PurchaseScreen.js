import React, { useState } from 'react';
import { Alert, Pressable, Text, View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../context/WalletContext';
import { Ionicons } from '@expo/vector-icons';

const packs = [
  { label: 'Starter Pack', diamonds: 50, price: 299, bonus: '0' },
  { label: 'Basic Pack', diamonds: 100, price: 499, bonus: '0' },
  { label: 'Value Pack', diamonds: 200, price: 899, bonus: '+10' },
  { label: 'Pro Pack', diamonds: 300, price: 1299, bonus: '+20' },
  { label: 'Mega Bundle', diamonds: 600, price: 2299, bonus: '+50 FREE' },
];

function DiamondPackCard({ pack, selected, onPress }) {
  const isSelected = selected.diamonds === pack.diamonds;
  const gradientColors = isSelected ? ['#ff529f', '#cb00a2'] : ['#1c1c1c', '#0f0f0f'];

  return (
    <Pressable onPress={onPress} style={styles.packWrapper}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.packCard, isSelected ? styles.packCardSelected : styles.packCardDefault]}
      >
        {pack.bonus !== '0' && (
          <View style={styles.bonusBadge}>
            <Text style={styles.bonusText}>{pack.bonus}</Text>
          </View>
        )}

        <Ionicons name="diamond" size={32} color={isSelected ? '#FDE68A' : '#888'} />
        <Text style={styles.packLabel}>{pack.label}</Text>
        <View style={styles.diamondAmountContainer}>
          <Text style={styles.diamondAmountText}>{pack.diamonds}</Text>
          <Text style={styles.diamondSymbol}> 💎</Text>
        </View>
        <View style={styles.pricePill}>
          <Text style={styles.priceText}>Buy for ₹{pack.price}</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

export default function PurchaseScreen() {
  const { creditDiamonds } = useWallet();
  const [selected, setSelected] = useState(packs[0]);
  const insets = useSafeAreaInsets();

  const buyNow = async () => {
    await creditDiamonds(selected.diamonds);
    Alert.alert('Added', `Credited ${selected.diamonds} diamonds`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={["#ff529f", "#cb00a2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: (insets.top || 0) + 4, paddingBottom: 10 }]}
      >
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Buy Diamonds 💎</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>1. Choose a Diamond Pack</Text>
        <View style={styles.packsContainer}>
          {packs.map((p) => (
            <DiamondPackCard key={p.diamonds} pack={p} selected={selected} onPress={() => setSelected(p)} />
          ))}
        </View>

        <View style={styles.separator} />
        <Text style={styles.sectionTitle}>2. Add Diamonds</Text>
        <Pressable onPress={buyNow} style={({ pressed }) => [styles.btnPrimary, { opacity: pressed ? 0.8 : 1 }]}>
          <Text style={styles.btnText}>Buy ₹{selected.price} for {selected.diamonds} 💎</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.5,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  scrollContent: { padding: 16 },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 15,
    borderLeftWidth: 3,
    borderColor: '#ff529f',
    paddingLeft: 8,
  },
  separator: { height: 1, backgroundColor: '#1c1c1c', marginVertical: 20 },
  packsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  packWrapper: { width: '48%', marginBottom: 12 },
  packCard: { borderRadius: 15, padding: 15, alignItems: 'center', justifyContent: 'space-between', height: 160, borderWidth: 2 },
  packCardDefault: { borderColor: '#1c1c1c' },
  packCardSelected: { borderColor: '#ff529f', shadowColor: '#ff529f', shadowOpacity: 0.5, shadowRadius: 10, elevation: 10 },
  bonusBadge: { position: 'absolute', top: -10, right: -10, backgroundColor: '#00cc66', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, transform: [{ rotate: '5deg' }], zIndex: 10 },
  bonusText: { color: '#fff', fontWeight: '900', fontSize: 10 },
  packLabel: { color: '#ccc', fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginTop: 5 },
  diamondAmountContainer: { flexDirection: 'row', alignItems: 'center' },
  diamondAmountText: { color: '#fff', fontSize: 24, fontWeight: '900' },
  diamondSymbol: { color: '#FDE68A', fontSize: 20, fontWeight: '900' },
  pricePill: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, marginTop: 10 },
  priceText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  btnPrimary: { backgroundColor: '#ff529f', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20, marginBottom: 10 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '800', textTransform: 'uppercase' },
});
