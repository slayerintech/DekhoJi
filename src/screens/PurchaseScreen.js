import React, { useState } from 'react';
import { Alert, Image, Pressable, Text, TextInput, View, StyleSheet, ScrollView, Linking, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../context/WalletContext';
import { Ionicons } from '@expo/vector-icons';

 

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

const UPI_ID = 'yourupi@bank';
const PAYEE_NAME = 'DekhoJi';
const UPI_LOGOS = {
  gpay: 'https://seeklogo.com/images/G/google-pay-logo-01E36658FE-seeklogo.com.png',
  phonepe: 'https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png',
  paytm: 'https://download.logo.wine/logo/Paytm/Paytm-Logo.wine.png',
};

function upiUrl(amount, tn) {
  const q = [
    `pa=${encodeURIComponent(UPI_ID)}`,
    `pn=${encodeURIComponent(PAYEE_NAME)}`,
    `am=${encodeURIComponent(String(amount))}`,
    `cu=INR`,
    `tn=${encodeURIComponent(tn)}`,
  ].join('&');
  return `upi://pay?${q}`;
}

async function openUPIPayment(app, amount) {
  const tn = `DekhoJi ${amount} INR`;
  const url = upiUrl(amount, tn);
  if (Platform.OS === 'android') {
    let pkg = null;
    if (app === 'gpay') pkg = 'com.google.android.apps.nbu.paisa.user';
    if (app === 'phonepe') pkg = 'com.phonepe.app';
    if (app === 'paytm') pkg = 'net.one97.paytm';
    if (pkg) {
      const intentUrl = `intent://pay?${url.split('?')[1]}#Intent;scheme=upi;package=${pkg};end`;
      try { await Linking.openURL(intentUrl); return; } catch {}
    }
  }
  try { await Linking.openURL(url); } catch { Alert.alert('Payment', 'Unable to open UPI app. Please scan the QR.'); }
}

async function openAnyUPIPayment(amount) {
  const tn = `DekhoJi ${amount} INR`;
  const url = upiUrl(amount, tn);
  if (Platform.OS === 'android') {
    const pkgs = [
      { app: 'gpay', pkg: 'com.google.android.apps.nbu.paisa.user' },
      { app: 'phonepe', pkg: 'com.phonepe.app' },
      { app: 'paytm', pkg: 'net.one97.paytm' },
    ];
    for (const { pkg } of pkgs) {
      const intentUrl = `intent://pay?${url.split('?')[1]}#Intent;scheme=upi;package=${pkg};end`;
      try { await Linking.openURL(intentUrl); return; } catch {}
    }
  }
  try { await Linking.openURL(url); } catch { Alert.alert('Payment', 'Unable to open UPI app. Please scan the QR.'); }
}

function UpiLogo({ uri, label }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <View style={styles.upiLogoFallback}>
        <Text style={styles.upiLogoFallbackText}>{label}</Text>
      </View>
    );
  }
  return <Image source={{ uri }} style={styles.upiLogoImg} onError={() => setErr(true)} />;
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
    const [utr, setUtr] = useState('');
    const insets = useSafeAreaInsets();

    const verifyPayment = () => {
        if (!utr || utr.length < 8) {
            Alert.alert('Invalid UTR', 'Please enter the 8+ digit UTR/Reference number from your payment.');
            return;
        }
        creditDiamonds(selected.diamonds);
        Alert.alert('Payment Verified', `Successfully added ${selected.diamonds} diamonds to your account.`);
        // navigation.goBack(); 
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

                {/* Section 1: Diamond Packs */}
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

                {/* Section 2: QR Code Payment - FIX APPLIED HERE */}
                <Text style={styles.sectionTitle}>
                    <Text>2. Scan & Pay </Text> 
                    <Text style={{fontWeight: '900'}}>(₹{selected.price})</Text>
                </Text>
                <Pressable onPress={() => openAnyUPIPayment(selected.price)} style={styles.upiSingleBtn}>
                  <View style={styles.upiSingleBtnInner}>
                    <UpiLogo uri={UPI_LOGOS.gpay} label="GPay" />
                    <UpiLogo uri={UPI_LOGOS.phonepe} label="PhonePe" />
                    <UpiLogo uri={UPI_LOGOS.paytm} label="Paytm" />
                    <Text style={styles.upiBtnText}>Pay with UPI</Text>
                  </View>
                </Pressable>

                <View style={styles.qrContainer}>
                    <Image 
                        source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PAY_TO_YOUR_QR' }} 
                        style={styles.qrImage} 
                    />
                    
                    {/* QR Subtitle - FIX APPLIED HERE */}
                    <Text style={styles.qrSubtitle}>
                        <Text>Make a payment of </Text>
                        <Text style={{fontWeight: 'bold'}}>₹{selected.price}</Text>
                        <Text> to the QR code above.</Text>
                    </Text>
                </View>
                
                <View style={styles.separator} />
                
                {/* Section 3: UTR Input & Verification */}
                <Text style={styles.sectionTitle}>3. Enter UTR/Ref No. </Text>
                <TextInput 
                    value={utr} 
                    onChangeText={setUtr} 
                    keyboardType="numeric"
                    placeholder="Enter 12-digit UTR/Reference number" 
                    placeholderTextColor="#777" 
                    style={styles.input} 
                />
                
                <Pressable 
                    onPress={verifyPayment} 
                    style={({ pressed }) => [
                        styles.btnPrimary,
                        { opacity: pressed ? 0.8 : 1 }
                    ]}
                >
                    <Text style={styles.btnText}>VERIFY PAYMENT & GET {selected.diamonds} 💎</Text>
                </Pressable>

                <Text style={styles.noteText}>Note: UTR verification can take up to 5 minutes.</Text>

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