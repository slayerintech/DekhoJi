import React, { useRef, useState } from 'react';
import { Alert, Pressable, Text, View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../context/WalletContext';
import { Ionicons } from '@expo/vector-icons';
import * as IAP from 'react-native-iap';

 

// -----------------------------------------------------------
// DATA
// -----------------------------------------------------------

const packs = [
    { label: 'Starter Pack', diamonds: 50, price: 299, bonus: '0' },
    { label: 'Basic Pack', diamonds: 100, price: 499, bonus: '0' },
    { label: 'Value Pack', diamonds: 200, price: 899, bonus: '+10' },
    { label: 'Pro Pack', diamonds: 300, price: 1299, bonus: '+20' },
    { label: 'Mega Bundle', diamonds: 600, price: 2299, bonus: '+50 FREE' },
];
function skuForDiamonds(d) {
  const map = { 50: 'dj_diamonds_50', 100: 'dj_diamonds_100', 200: 'dj_diamonds_200', 300: 'dj_diamonds_300', 600: 'dj_diamonds_600' };
  return map[d];
}
function diamondsForSku(sku) {
  const map = { dj_diamonds_50: 50, dj_diamonds_100: 100, dj_diamonds_200: 200, dj_diamonds_300: 300, dj_diamonds_600: 600 };
  return map[sku] || 0;
}

// -----------------------------------------------------------
// 1. Diamond Card Component
// -----------------------------------------------------------

function DiamondPackCard({ pack, selected, onPress }) {
    const isSelected = selected.diamonds === pack.diamonds;
    
    const gradientColors = isSelected 
        ? ['#ff529f', '#cb00a2'] 
        : ['#1c1c1c', '#0f0f0f'];

    return (
        <Pressable 
            onPress={onPress} 
            style={styles.packWrapper}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.packCard,
                    isSelected ? styles.packCardSelected : styles.packCardDefault
                ]}
            >
                {pack.bonus !== '0' && (
                    <View style={styles.bonusBadge}>
                        <Text style={styles.bonusText}>{pack.bonus}</Text>
                    </View>
                )}
                
                <Ionicons name="diamond" size={32} color={isSelected ? "#FDE68A" : "#888"} />

                <Text style={styles.packLabel}>{pack.label}</Text>
                
                {/* Diamond Amount: Already safe */}
                <View style={styles.diamondAmountContainer}>
                    <Text style={styles.diamondAmountText}>
                        {pack.diamonds}
                    </Text>
                    <Text style={styles.diamondSymbol}> 💎</Text>
                </View>


                <View style={styles.pricePill}>
                    <Text style={styles.priceText}>Buy for ₹{pack.price}</Text>
                </View>
            </LinearGradient>
        </Pressable>
    );
}

// -----------------------------------------------------------
// 2. Main Screen (Text String Fixes Applied Here)
// -----------------------------------------------------------

export default function PurchaseScreen({ navigation }) {
    const { creditDiamonds } = useWallet();
    const [selected, setSelected] = useState(packs[0]);
    const [iapReady, setIapReady] = useState(false);
    const [products, setProducts] = useState([]);
    const insets = useSafeAreaInsets();
    const purchaseUpdateSub = useRef(null);
    const purchaseErrorSub = useRef(null);

    React.useEffect(() => {
      (async () => {
        try {
          const ok = await IAP.initConnection();
          if (!ok) return;
          const ids = packs.map((p) => skuForDiamonds(p.diamonds)).filter(Boolean);
          const res = await IAP.getProducts(ids);
          setProducts(res || []);
          purchaseUpdateSub.current = IAP.purchaseUpdatedListener(async (purchase) => {
            const receipt = purchase?.transactionReceipt;
            if (receipt) {
              const d = diamondsForSku(purchase.productId);
              if (d) {
                await creditDiamonds(d);
                Alert.alert('Purchase successful', `Added ${d} diamonds.`);
              }
              try { await IAP.finishTransaction(purchase, true); } catch {}
            }
          });
          purchaseErrorSub.current = IAP.purchaseErrorListener((error) => {
            if (error?.code === 'E_USER_CANCELLED') {
              Alert.alert('Purchase canceled', 'Transaction canceled');
            } else {
              Alert.alert('Purchase failed', 'Unable to complete purchase');
            }
          });
          setIapReady(true);
        } catch {}
      })();
      return () => {
        try { purchaseUpdateSub.current?.remove(); } catch {}
        try { purchaseErrorSub.current?.remove(); } catch {}
        try { IAP.endConnection(); } catch {}
      };
    }, []);

    const buyNow = async () => {
      const sku = skuForDiamonds(selected.diamonds);
      if (!iapReady || !sku) {
        Alert.alert('Purchases unavailable', 'Use a development or production build to buy.');
        return;
      }
      try {
        if (typeof IAP.requestPurchase === 'function') {
          await IAP.requestPurchase(sku);
        } else if (typeof IAP.requestPurchaseSku === 'function') {
          await IAP.requestPurchaseSku(sku);
        } else {
          await IAP.requestPurchase({ skus: [sku] });
        }
      } catch {
        Alert.alert('Purchase failed', 'Unable to initiate purchase');
      }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient 
                colors={["#140014", "#19053a", "#cb00a2"]} 
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
                        <DiamondPackCard
                            key={p.diamonds}
                            pack={p}
                            selected={selected}
                            onPress={() => setSelected(p)}
                        />
                    ))}
                </View>
                
                <View style={styles.separator} />
                <Text style={styles.sectionTitle}>2. Pay via Google Play</Text>
                <Pressable 
                  onPress={buyNow}
                  style={({ pressed }) => [styles.btnPrimary, { opacity: pressed ? 0.8 : 1 }]}
                >
                  <Text style={styles.btnText}>Buy ₹{selected.price} for {selected.diamonds} 💎</Text>
                </Pressable>

            </ScrollView>
        </SafeAreaView>
    );
}

// -----------------------------------------------------------
// 3. STYLES
// -----------------------------------------------------------

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
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
    headerTitle: {
        color: '#fff',
        fontSize: 18, 
        fontWeight: '800',
    },
    scrollContent: {
        padding: 16,
    },
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
    separator: {
        height: 1,
        backgroundColor: '#1c1c1c',
        marginVertical: 20,
    },
    // --- Pack Cards ---
    packsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    packWrapper: {
        width: '48%', 
        marginBottom: 12,
    },
    packCard: {
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 160,
        borderWidth: 2,
    },
    packCardDefault: {
        borderColor: '#1c1c1c',
    },
    packCardSelected: {
        borderColor: '#ff529f',
        shadowColor: '#ff529f',
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    bonusBadge: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#00cc66',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
        transform: [{ rotate: '5deg' }],
        zIndex: 10,
    },
    bonusText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 10,
    },
    packLabel: {
        color: '#ccc',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: 5,
    },
    
    diamondAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    diamondAmountText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
    },
    diamondSymbol: {
        color: '#FDE68A',
        fontSize: 20,
        fontWeight: '900',
    },
    
    pricePill: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 50,
        marginTop: 10,
    },
    priceText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },
    // --- QR Section ---
    qrContainer: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#121212',
        borderRadius: 15,
    },
    qrImage: {
        width: 180,
        height: 180,
        backgroundColor: '#fff', 
        borderRadius: 5,
    },
    qrSubtitle: {
        color: '#aaa',
        marginTop: 15,
        fontSize: 12,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    // --- Input & Button ---
    input: {
        backgroundColor: '#1c1c1c',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        color: '#fff',
        fontSize: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#333',
    },
    btnPrimary: {
        backgroundColor: '#ff529f', 
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    btnText: { 
        color: '#fff', 
        fontSize: 17, 
        fontWeight: '800',
        textTransform: 'uppercase'
    },
    noteText: {
        color: '#999',
        fontSize: 12,
        textAlign: 'center',
        paddingTop: 10,
    },
    upiBtnText: {
        color: '#fff',
        fontWeight: '700',
    },
    upiSingleBtn: {
        backgroundColor: '#ff529f',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    upiSingleBtnInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    upiLogoImg: {
        width: 30,
        height: 30,
        marginRight: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    upiLogoFallback: {
        width: 30,
        height: 30,
        marginRight: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    upiLogoFallbackText: {
        color: '#111',
        fontSize: 10,
        fontWeight: '700',
    }
});
