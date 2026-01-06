import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, ScrollView, Alert, Linking, AppState } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';
import { useCall } from '../context/CallContext';

// Payment Configuration
const UPI_VPA = '9109696780@jupiteraxis'; 
const UPI_NAME = 'DekhoJi App';

const DIAMOND_PACKS = [
  { id: '1', label: 'Starter Pack', diamonds: 50, price: 100, bonus: '0' },
  { id: '2', label: 'Basic Pack', diamonds: 100, price: 199, bonus: '0' },
  { id: '3', label: 'Value Pack', diamonds: 200, price: 399, bonus: '+10' },
  { id: '4', label: 'Pro Pack', diamonds: 300, price: 599, bonus: '+20' },
  { id: '5', label: 'Mega Bundle', diamonds: 600, price: 999, bonus: '+50 FREE' },
];

function DiamondPackCard({ pack, selected, onPress }) {
  const isSelected = selected.id === pack.id;
  
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

export default function DiamondSheet() {
  const { showDiamondSheet, setShowDiamondSheet, creditDiamonds } = useWallet();
  const { setIsBusy } = useCall();
  
  const [selectedPack, setSelectedPack] = useState(DIAMOND_PACKS[0]);
  
  // Payment State
  const [pendingTxn, setPendingTxn] = useState(null);
  const appState = useRef(AppState.currentState);
  const paymentProcessed = useRef(false);

  // Manage Busy State
  useEffect(() => {
    if (showDiamondSheet) {
      setIsBusy(true);
    } else {
      setIsBusy(false);
    }
  }, [showDiamondSheet, setIsBusy]);

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
          closeDiamondSheet(); // Close sheet on success
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

  const closeDiamondSheet = () => {
    setShowDiamondSheet(false);
  };

  const handlePurchase = async () => {
    paymentProcessed.current = false;
    const amount = selectedPack.price.toFixed(2);
    const tid = Date.now().toString();
    const note = `Purchase ${selectedPack.label}`;
    
    // Add Callback URL for automatic verification
    // Scheme must match app.json 'scheme'
    const callbackUrl = `dekhoji://payment`; 
    
    // Construct UPI Intent URL
    const url = `upi://pay?pa=${UPI_VPA}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}&tid=${tid}&url=${encodeURIComponent(callbackUrl)}`;

    try {
      await Linking.openURL(url);
      setPendingTxn(selectedPack);
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

  if (!showDiamondSheet) return null;

  return (
    <Modal visible={showDiamondSheet} transparent={true} animationType="slide" onRequestClose={closeDiamondSheet}>
      <Pressable style={styles.sheetOverlay} onPress={closeDiamondSheet}>
        <Pressable style={styles.sheetContainer} onPress={e => e.stopPropagation()}>
          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Store</Text>
              <Text style={styles.sheetSubtitle}>Top up your wallet</Text>
            </View>
            <Pressable onPress={closeDiamondSheet} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
          </View>
          
          <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
            {DIAMOND_PACKS.map((pack) => (
              <DiamondPackCard 
                key={pack.id} 
                pack={pack} 
                selected={selectedPack} 
                onPress={() => setSelectedPack(pack)} 
              />
            ))}
            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Bottom Pay Bar */}
          <View style={styles.bottomBar}>
             <View>
                 <Text style={styles.totalLabel}>Total</Text>
                 <Text style={styles.totalPrice}>₹{selectedPack.price}</Text>
             </View>
             <Pressable onPress={handlePurchase}>
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
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '70%',
    paddingBottom: 40,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  sheetSubtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2c2c2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    flex: 1,
  },
  packRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c2c2e',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  packRowSelected: {
    borderColor: '#ff529f',
    backgroundColor: '#2c2c2e', // Keep dark background
  },
  packInfo: {
    flex: 1,
  },
  diamondContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  diamondCount: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  packLabel: {
    color: '#888',
    fontSize: 14,
  },
  bonusText: {
    color: '#34C759',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  priceTextSelected: {
    color: '#ff529f',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2c2c2e',
    marginTop: 10,
  },
  totalLabel: {
    color: '#888',
    fontSize: 12,
  },
  totalPrice: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  payBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
