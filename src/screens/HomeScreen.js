import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../context/WalletContext';
import { Ionicons } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';
 

const baseNames = [
  'Priya', 'Aisha', 'Neha', 'Rani', 'Anjali', 'Pooja', 'Kiran', 'Sunita', 'Sapna', 'Nisha',
  'Shreya', 'Aparna', 'Divya', 'Ritika', 'Meena', 'Komal', 'Sneha', 'Isha', 'Rupal', 'Juhi',
];
const surnames = ['Sharma', 'Kumari', 'Patel', 'Kaur', 'Das', 'Reddy', 'Joshi', 'Pandey', 'Verma', 'Gupta'];

const girlImages = [
  require('../../assets/img12.jpeg'),
  require('../../assets/img22.jpeg'),
  require('../../assets/img10.jpeg'),
  require('../../assets/img14.jpeg'),
  require('../../assets/img1.jpeg'),
  require('../../assets/img6.jpeg'),
  require('../../assets/img7.jpeg'),
  require('../../assets/img8.jpeg'),
  require('../../assets/img9.jpeg'),
  require('../../assets/img3.jpeg'),
  require('../../assets/img11.jpeg'),
  require('../../assets/img5.jpeg'),
  require('../../assets/img13.jpeg'),
  require('../../assets/img4.jpeg'),
  require('../../assets/img15.jpeg'),
  require('../../assets/img16.jpeg'),
  require('../../assets/img17.jpeg'),
  require('../../assets/img18.jpeg'),
  require('../../assets/img19.jpeg'),
  require('../../assets/img20.jpeg'),
  require('../../assets/img21.jpeg'),
  require('../../assets/img22.jpeg'),
];

function viewersFor(i) {
  const base = 200 + ((i * 73) % 4800);
  return base;
}

function fmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0) + 'k' : String(n);
}

const profiles = Array.from({ length: 22 }).map((_, i) => {
  const first = baseNames[i % baseNames.length];
  const last = surnames[i % surnames.length];
  const name = `${first} ${last}`;
  const live = true;
  return {
    id: String(i + 1),
    name,
    img: girlImages[i % girlImages.length],
    live,
    viewers: viewersFor(i + 1),
  };
});

function ProfileCard({ item, onPress }) {
  const [failed, setFailed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardWrapper,
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <View style={styles.card}>
        {failed ? (
          <LinearGradient colors={['#101010', '#2b1052']} style={styles.cardImage}>
            <Text style={styles.cardFallbackText}>Image unavailable</Text>
          </LinearGradient>
        ) : (
          <View style={styles.cardImage}>
            <Image
              source={typeof item.img === 'string' ? { uri: item.img } : item.img}
              style={StyleSheet.absoluteFillObject}
              resizeMode="none"
              onError={() => setFailed(true)}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              start={{ x: 0, y: 0.2 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        )}

        <View
          style={[
            styles.liveBadge,
            { backgroundColor: item.live ? '#e11d48' : '#4b5563' },
          ]}
        >
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>{item.live ? 'LIVE' : 'OFFLINE'}</Text>
        </View>

        <View style={[styles.viewerPill, styles.viewerTop]}>
          <Ionicons name="eye" size={14} color="#F9FAFB" />
          <Text style={styles.viewerText}>{fmt(item.viewers)}</Text>
        </View>

        <View style={styles.cardFooter}>
          <Text numberOfLines={1} style={styles.cardName}>
            {item.name}
          </Text>
          <View style={styles.locationPill}>
            <Text style={styles.locationFlag}>🇮🇳</Text>
            <Text style={styles.locationText}>India</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const { diamonds, setLiveRooms, globalCallVisible, globalCallIndex, liveRooms } = useWallet();
  const insets = useSafeAreaInsets();
  const bannerY = React.useRef(new Animated.Value(-80)).current;
  const bannerOpacity = React.useRef(new Animated.Value(0)).current;
  const iconScale = React.useRef(new Animated.Value(1)).current;
  

  useEffect(() => {
    setLiveRooms(profiles.filter((p) => p.live));
  }, [setLiveRooms]);

  useEffect(() => {
    if (globalCallVisible) {
      bannerY.setValue(-80);
      bannerOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(bannerY, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(bannerOpacity, { toValue: 1, duration: 400, easing: Easing.ease, useNativeDriver: true }),
      ]).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(iconScale, { toValue: 1.12, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(iconScale, { toValue: 1.0, duration: 600, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [globalCallVisible, globalCallIndex]);

  const renderItem = ({ item }) => (
    <ProfileCard
      item={item}
      onPress={() => navigation.navigate('LiveWatch', { profile: item })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {globalCallVisible && (
        <Animated.View style={{ position: 'absolute', top: (insets.top || 0) + 8, left: 12, right: 12, transform: [{ translateY: bannerY }], opacity: bannerOpacity, zIndex: 50 }}>
          <Pressable onPress={() => navigation.navigate('Purchase')}>
            <LinearGradient colors={["#0f172a", "#1f2937", "#065f46"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 18, paddingVertical: 14, paddingHorizontal: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={typeof (liveRooms[globalCallIndex]?.img) === 'string' ? { uri: liveRooms[globalCallIndex]?.img } : liveRooms[globalCallIndex]?.img} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>Incoming Video Call</Text>
                  <Text style={{ color: '#FDE68A', fontSize: 13 }}>{liveRooms[globalCallIndex]?.name || 'Host'} is calling…</Text>
                </View>
                <Animated.View style={{ transform: [{ scale: iconScale }] }}>
                  <Ionicons name="videocam" size={36} color="#22c55e" />
                </Animated.View>
              </View>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}
      <LinearGradient
        colors={['#140014', '#19053a', '#cb00a2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.header,
          { paddingTop: (insets.top || 0) -12 },
        ]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.appTitle}>DekhoJi Live</Text>
            <Text style={styles.appSubtitle}>Discover trending live rooms</Text>
          </View>

          <Pressable
            onPress={() => navigation.navigate('Purchase')}
            style={({ pressed }) => [
              styles.balancePill,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.03)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.balanceGradient}
            >
              <Ionicons name="diamond" size={20} color="#FDE68A" />
              <Text style={styles.balanceText}>{diamonds}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </LinearGradient>

      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: (insets.bottom || 0) + 16 },
        ]}
      />
    </SafeAreaView>
  );
}

const RADIUS = 18;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    color: '#F9FAFB',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  appSubtitle: {
    marginTop: 4,
    color: '#9CA3AF',
    fontSize: 12,
  },
  balancePill: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  balanceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(248,250,252,0.12)',
  },
  balanceText: {
    color: '#F9FAFB',
    marginLeft: 6,
    fontWeight: '800',
    fontSize: 18,
  },
  listContent: {
    paddingHorizontal: 6,
    paddingTop: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 2,
  },
  card: {
    borderRadius: RADIUS,
    overflow: 'hidden',
    backgroundColor: '#020617',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  cardImage: {
    height: 260,
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardFallbackText: {
    color: '#E5E7EB',
    opacity: 0.8,
    textAlign: 'center',
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#FEE2E2',
    marginRight: 5,
  },
  liveText: {
    color: '#F9FAFB',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 0.6,
  },
  viewerTop: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  cardFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  cardName: {
    color: '#0fd40fff',
    fontWeight: '700',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(225,29,72,0.18)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(225,29,72,0.35)',
  },
  locationText: {
    color: '#FDE68A',
    fontWeight: '700',
    fontSize: 11,
    marginLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  locationFlag: {
    fontSize: 12,
    marginRight: 4,
  },
  viewerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(225,29,72,0.18)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(225,29,72,0.35)',
  },
  viewerText: {
    color: '#0fd40fff',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
