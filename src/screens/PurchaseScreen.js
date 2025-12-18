import React, { useState, useEffect, useRef } from 'react';
import { Alert, Pressable, Text, View, StyleSheet, ScrollView, Linking, AppState, Platform, Animated, Easing } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../context/WalletContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const packs = [
  { label: 'Starter Pack', diamonds: 50, price: 299, bonus: '0' },
  { label: 'Basic Pack', diamonds: 100, price: 499, bonus: '0' },
  { label: 'Value Pack', diamonds: 200, price: 899, bonus: '+10' },
  { label: 'Pro Pack', diamonds: 300, price: 1299, bonus: '+20' },
  { label: 'Mega Bundle', diamonds: 600, price: 2299, bonus: '+50 FREE' },
];

// Payment Configuration
const UPI_VPA = '9109696780@jupiteraxis'; 
const UPI_NAME = 'DekhoJi App';

function DiamondPackCard({ pack, selected, onPress }) {
  const isSelected = selected.diamonds === pack.diamonds;
  
  // Sleek minimalist card design
  return (
    <Pressable onPress={onPress} style={[styles.packRow, isSelected && styles.packRowSelected]}>
      <View style={styles.packInfo}>
          <View style={styles.diamondContainer}>
             <Ionicons name="diamond" size={24} color="#FFD700" />
             <Text style={styles.diamondCount}>{pack.diamonds}</Text>
          </View>
          <Text style={styles.packLabel}>{pack.label}</Text>
          {pack.bonus !== '0' && <Text style={styles.bonusText}>{pack.bonus} Bonus</Text>}
      </View>
      
      <View style={styles.priceContainer}>
          <Text style={[styles.priceText, isSelected && styles.priceTextSelected]}>₹{pack.price}</Text>
          {isSelected && <Ionicons name="checkmark-circle" size={20} color="#ff529f" style={{marginLeft: 8}}/>}
      </View>
    </Pressable>
  );
}

export default function PurchaseScreen({ navigation }) {
  const { creditDiamonds, diamonds } = useWallet();
  const [selected, setSelected] = useState(packs[0]);
  const insets = useSafeAreaInsets();
  
  // Payment State
  const [pendingTxn, setPendingTxn] = useState(null);
  const appState = useRef(AppState.currentState);
  const paymentProcessed = useRef(false);
  const payScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(payScale, {
          toValue: 1.05,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(payScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Listener for Deep Links (Success/Failure Callback from UPI App)
    const handleUrl = (event) => {
      const { url } = event;
      if (url && url.includes('payment') && pendingTxn) {
        paymentProcessed.current = true; // Mark as handled so manual check doesn't fire
        
        // Simple parsing logic
        // URL format: dekhoji://payment?Status=SUCCESS&txnId=...
        const statusMatch = url.match(/[?&](Status|txnStatus|status)=([^&]+)/i);
        const status = statusMatch ? statusMatch[2].toUpperCase() : '';

        if (status === 'SUCCESS') {
          creditDiamonds(pendingTxn.diamonds, pendingTxn.label);
          Alert.alert('Payment Successful', `Your wallet has been credited with ${pendingTxn.diamonds} diamonds!`);
        } else {
          Alert.alert('Payment Failed', 'Transaction could not be completed.');
        }
        setPendingTxn(null);
      }
    };

    const sub = Linking.addEventListener('url', handleUrl);
    
    // Also check initial URL if app was launched from cold start
    Linking.getInitialURL().then(url => {
        if (url) handleUrl({ url });
    });

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground - check if we have a pending transaction
        if (pendingTxn) {
           // Wait briefly to see if a Deep Link (success callback) comes in
           setTimeout(() => {
             if (!paymentProcessed.current) {
                 // User returned to app, but we received no success callback.
                 // Assume cancelled or failed.
                 setPendingTxn(null);
                 Alert.alert(
                   "Transaction Failed", 
                   "We could not verify the payment. If money was deducted, it will be refunded by your bank within 48 hours."
                 );
             }
           }, 2000);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      sub.remove();
      subscription.remove();
    };
  }, [pendingTxn]);

  const buyNow = async () => {
    paymentProcessed.current = false;
    const amount = selected.price.toFixed(2);
    const tid = Date.now().toString();
    const note = `Purchase ${selected.label}`;
    
    // Add Callback URL for automatic verification
    // Scheme must match app.json 'scheme'
    const callbackUrl = `dekhoji://payment`; 
    
    // Construct UPI Intent URL
    const url = `upi://pay?pa=${UPI_VPA}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}&tid=${tid}&url=${encodeURIComponent(callbackUrl)}`;

    try {
      await Linking.openURL(url);
      setPendingTxn(selected);
    } catch (err) {
      // console.log("UPI open error:", err);
      Alert.alert(
        "Payment Method",
        "No UPI apps found on this device. Please install PhonePe, GPay, or Paytm to continue.",
        [
          { text: "OK", style: "cancel" }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { paddingTop: 10 }]}>
        <View>
          <Text style={styles.headerTitle}>Store</Text>
          <Text style={styles.headerSubtitle}>Top up your wallet</Text>
        </View>
        <View style={styles.walletBadge}>
             <Ionicons name="wallet" size={20} color="#FFD700" />
             <Text style={styles.walletText}>{diamonds || 0}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.subHeader}>Select a Plan</Text>
        <View style={styles.listContainer}>
          {packs.map((p) => (
            <DiamondPackCard key={p.diamonds} pack={p} selected={selected} onPress={() => setSelected(p)} />
          ))}
        </View>

      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]}>
         <View>
             <Text style={styles.totalLabel}>Total</Text>
             <Text style={styles.totalPrice}>₹{selected.price}</Text>
         </View>
         <Animated.View style={{ transform: [{ scale: payScale }] }}>
            <Pressable onPress={buyNow} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
                <LinearGradient
                    colors={['#ff529f', '#e91e63']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.payBtn}
                >
                    <Text style={styles.payBtnText}>Pay Now</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </LinearGradient>
            </Pressable>
         </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '700', letterSpacing: 0.5 },
  headerSubtitle: { color: '#888', fontSize: 13, marginTop: 4 },
  walletBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 215, 0, 0.15)', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)'
  },
  walletText: { color: '#FFD700', fontSize: 18, fontWeight: '700', marginLeft: 6 },
  
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  subHeader: { color: '#888', fontSize: 14, textTransform: 'uppercase', marginBottom: 15, fontWeight: '600', letterSpacing: 1 },
  
  listContainer: { gap: 12 },
  packRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  packRowSelected: {
    borderColor: '#ff529f',
    backgroundColor: '#1a1015',
  },
  packInfo: { justifyContent: 'center' },
  diamondContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  diamondCount: { color: '#fff', fontSize: 20, fontWeight: '700', marginLeft: 8 },
  packLabel: { color: '#888', fontSize: 14 },
  bonusText: { color: '#00cc66', fontSize: 12, fontWeight: '700', marginTop: 4 },
  
  priceContainer: { flexDirection: 'row', alignItems: 'center' },
  priceText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  priceTextSelected: { color: '#ff529f' },
  
  secureNote: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, opacity: 0.6 },
  secureText: { color: '#666', fontSize: 12, marginLeft: 6 },
  
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { color: '#888', fontSize: 12 },
  totalPrice: { color: '#fff', fontSize: 22, fontWeight: '700' },
  payBtn: {
    // backgroundColor: '#00cc66', // Green color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
