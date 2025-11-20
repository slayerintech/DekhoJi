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

const baseNames = [
  'Priya', 'Aisha', 'Neha', 'Rani', 'Anjali', 'Pooja', 'Kiran', 'Sunita', 'Sapna', 'Nisha',
  'Shreya', 'Aparna', 'Divya', 'Ritika', 'Meena', 'Komal', 'Sneha', 'Isha', 'Rupal', 'Juhi',
];
const surnames = ['Sharma', 'Kumari', 'Patel', 'Kaur', 'Das', 'Reddy', 'Joshi', 'Pandey', 'Verma', 'Gupta'];

function viewersFor(i) {
  const base = 200 + ((i * 73) % 4800);
  return base;
}

function fmt(n) {
  return n >= 1000 ? (n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0) + 'k' : String(n);
}

const profiles = Array.from({ length: 50 }).map((_, i) => {
  const first = baseNames[i % baseNames.length];
  const last = surnames[i % surnames.length];
  const name = `${first} ${last}`;
  const live = true;
  return {
    id: String(i + 1),
    name,
    img: `https://loremflickr.com/1080/1350/indian,model,girl?lock=${i + 1}`,
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
              source={{ uri: item.img }}
              style={StyleSheet.absoluteFillObject}
              resizeMode="cover"
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

        <View style={styles.cardFooter}>
          <Text numberOfLines={1} style={styles.cardName}>
            {item.name}
          </Text>
          <View style={styles.viewerPill}>
            <Ionicons name="eye" size={14} color="#F9FAFB" />
            <Text style={styles.viewerText}>{fmt(item.viewers)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const { diamonds, setLiveRooms } = useWallet();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setLiveRooms(profiles.filter((p) => p.live));
  }, [setLiveRooms]);

  const renderItem = ({ item }) => (
    <ProfileCard
      item={item}
      onPress={() => navigation.navigate('LiveWatch', { profile: item })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
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
              <Ionicons name="diamond" size={16} color="#FDE68A" />
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
    paddingHorizontal: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(248,250,252,0.12)',
  },
  balanceText: {
    color: '#F9FAFB',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 16,
    marginHorizontal: 4,
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
    height: 200,
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
    overflow: 'hidden',
    justifyContent: 'flex-end',
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#FEE2E2',
    marginRight: 5,
  },
  liveText: {
    color: '#F9FAFB',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.6,
  },
  cardFooter: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15,23,42,0.95)',
  },
  cardName: {
    color: '#F9FAFB',
    fontWeight: '700',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  viewerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewerText: {
    color: '#E5E7EB',
    fontWeight: '600',
    fontSize: 12,
    marginLeft: 4,
  },
});
