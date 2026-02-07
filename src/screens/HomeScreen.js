import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Alert,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../context/WalletContext';
import { Ionicons } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';
import { InterstitialAd, AdEventType, TestIds, isExpoGo } from '../utils/AdManager';

const baseNames = [
  'Priya', 'Aisha', 'Neha', 'Rani', 'Anjali', 'Pooja', 'Kiran', 'Sunita', 'Sapna', 'Nisha',
  'Shreya', 'Aparna', 'Divya', 'Ritika', 'Meena', 'Komal', 'Sneha', 'Isha', 'Rupal', 'Juhi',
];
const surnames = ['Sharma', 'Kumari', 'Patel', 'Kaur', 'Das', 'Reddy', 'Joshi', 'Pandey', 'Verma', 'Gupta'];

// Static images from assets
const girlImages = [
  require('../../assets/img1.jpeg'),
  require('../../assets/img3.jpeg'),
  require('../../assets/img4.jpeg'),
  require('../../assets/img5.jpeg'),
  require('../../assets/img6.jpeg'),
  require('../../assets/img7.jpeg'),
  require('../../assets/img8.jpeg'),
  require('../../assets/img9.jpeg'),
  require('../../assets/img10.jpeg'),
  require('../../assets/img11.jpeg'),
  require('../../assets/img12.jpeg'),
  require('../../assets/img13.jpeg'),
  require('../../assets/img14.jpeg'),
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

const initialProfiles = Array.from({ length: 40 }).map((_, i) => {
  const first = baseNames[i % baseNames.length];
  const last = surnames[i % surnames.length];
  const name = `${first} ${last}`;
  const live = true;
  
  // Use static images cyclically
  const img = girlImages[i % girlImages.length];
  
  return {
    id: String(i + 1),
    name,
    img, // static require
    live,
    viewers: viewersFor(i + 1),
  };
});

const interstitialAdUnitId = Platform.select({
  ios: 'ca-app-pub-7503400330650109/6468740733',
  android: 'ca-app-pub-7503400330650109/6468740733',
  default: 'ca-app-pub-7503400330650109/6468740733',
});

const homeInterstitial = InterstitialAd.createForAdRequest(
  (__DEV__ && !isExpoGo) ? TestIds.INTERSTITIAL : interstitialAdUnitId
);

const Pulse = ({ delay }) => {
  const anim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        })
      )
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.pulseRing,
        {
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.5], // Reduced scale for grid view
              }),
            },
          ],
          opacity: anim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.6, 0.3, 0],
          }),
        },
      ]}
    />
  );
};

function ProfileCard({ item, onPress }) {
  const [failed, setFailed] = useState(false);
  const scale = React.useRef(new Animated.Value(1)).current;
  const imageScale = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (item.live) {
      // Badge Pulse
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Image Breathing Animation (Minimal)
      Animated.loop(
        Animated.sequence([
          Animated.timing(imageScale, {
            toValue: 1.03, // Subtle scale up
            duration: 1500, // Slower breath
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(imageScale, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [item.live]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardWrapper,
        { transform: [{ scale: pressed ? 0.95 : 1 }] },
      ]}
    >
      <View style={styles.cardContainer}>
        <View style={styles.avatarContainer}>
          {item.live && (
            <>
              <Pulse delay={0} />
              <Pulse delay={1000} />
            </>
          )}
          <Animated.Image
            source={typeof item.img === 'string' ? { uri: item.img } : item.img}
            style={[styles.avatarImage, { transform: [{ scale: imageScale }] }]}
            resizeMode="cover"
            onError={() => setFailed(true)}
          />
          {item.live && (
            <Animated.View style={[styles.liveBadgeSmall, { transform: [{ scale }] }]}>
              <Text style={styles.liveTextSmall}>LIVE</Text>
            </Animated.View>
          )}
        </View>
        <Text numberOfLines={1} style={styles.cardName}>
          {item.name}
        </Text>
        <Text style={styles.viewerTextSmall}>{fmt(item.viewers)} views</Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const { diamonds, setLiveRooms, globalCallVisible, globalCallIndex, liveRooms, setShowDiamondSheet } = useWallet();
  const insets = useSafeAreaInsets();
  const bannerY = React.useRef(new Animated.Value(-100)).current;
  const bannerOpacity = React.useRef(new Animated.Value(0)).current;
  const iconScale = React.useRef(new Animated.Value(1)).current;
  
  const [data, setData] = useState(initialProfiles);
  const [loadingMore, setLoadingMore] = useState(false);
  const [adReady, setAdReady] = useState(false);
  const pendingProfileRef = React.useRef(null);
  const diamondsRef = React.useRef(diamonds);

  useEffect(() => {
    diamondsRef.current = diamonds;
  }, [diamonds]);

  useEffect(() => {
    // Permission check removed as per user request
  }, []);


  useEffect(() => {
    const loadedListener = homeInterstitial.addAdEventListener(AdEventType.LOADED, () => {
      setAdReady(true);
    });

    const errorListener = homeInterstitial.addAdEventListener(AdEventType.ERROR, () => {
      setAdReady(false);
    });

    const closedListener = homeInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
      const profile = pendingProfileRef.current;
      pendingProfileRef.current = null;
      setAdReady(false);
      
      // Check for diamonds AFTER ad is closed
      if (diamondsRef.current < 10) {
        Alert.alert(
          "Insufficient Diamonds",
          "You need to have at least 10 diamonds to watch.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Buy Diamonds", onPress: () => setShowDiamondSheet(true) }
          ]
        );
      } else {
        if (profile) {
          navigation.navigate('LiveWatch', { profile });
        }
      }
      
      // Delay loading next ad to prevent navigation stutter/crashes
      setTimeout(() => {
        homeInterstitial.load();
      }, 1000);
    });

    homeInterstitial.load();

    return () => {
      loadedListener();
      errorListener();
      closedListener();
    };
  }, [navigation]);


  useEffect(() => {
    if (Platform.OS === 'android') {
      if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    }

    const interval = setInterval(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setData(prevData => {
        // Only shuffle the first 21 items (unique images) to ensure no duplicates in top view
        const uniqueCount = 21; 
        const head = prevData.slice(0, uniqueCount);
        const tail = prevData.slice(uniqueCount);
        
        // Fisher-Yates shuffle for the head
        for (let i = head.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [head[i], head[j]] = [head[j], head[i]];
        }
        
        return [...head, ...tail];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLiveRooms(data.filter((p) => p.live));
  }, [setLiveRooms, data]);

  const loadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    
    // Simulate network delay
    setTimeout(() => {
      const currentLength = data.length;
      const more = Array.from({ length: 10 }).map((_, i) => {
        const index = currentLength + i;
        const first = baseNames[index % baseNames.length];
        const last = surnames[index % surnames.length];
        const name = `${first} ${last}`;
        const img = girlImages[index % girlImages.length];
        
        return {
          id: String(index + 1),
          name,
          img,
          live: true,
          viewers: viewersFor(index + 1),
        };
      });
      
      setData(prev => [...prev, ...more]);
      setLoadingMore(false);
    }, 1500);
  };

  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 100 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#ff529f" />
        <Text style={styles.loadingText}>Loading more profiles...</Text>
      </View>
    );
  };

  useEffect(() => {
    // Global Call Banner removed as per request
  }, [globalCallVisible, globalCallIndex]);

  const handleProfilePress = async (item) => {
    if (!adReady) {
      // If ad is not ready, we still check for diamonds before navigating
      if (diamonds < 10) {
        Alert.alert(
          "Insufficient Diamonds",
          "You need to have at least 10 diamonds to watch.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Buy Diamonds", onPress: () => setShowDiamondSheet(true) }
          ]
        );
        return;
      }
      navigation.navigate('LiveWatch', { profile: item });
      return;
    }

    pendingProfileRef.current = item;
    homeInterstitial.show();
  };

  const renderItem = ({ item }) => (
    <ProfileCard
      item={item}
      onPress={() => handleProfilePress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.header, { marginTop: 10 }]}>
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.appTitle}>DekhoJi</Text>
            <View style={styles.liveTagContainer}>
               <Text style={styles.liveTagText}>LIVE</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Pressable
              onPress={() => setShowDiamondSheet(true)}
              style={({ pressed }) => [
                styles.balancePill,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <LinearGradient
                colors={['#2c2c2e', '#1c1c1e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.balanceGradient}
              >
                <Ionicons name="diamond" size={16} color="#FFD700" />
                <Text style={styles.balanceText}>{diamonds}</Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable 
              style={styles.iconButton}
              onPress={() => navigation.navigate('Chats')}
            >
               <Ionicons name="notifications-outline" size={24} color="#fff" />
               <View style={styles.notificationDot} />
            </Pressable>
          </View>
        </View>
      </View>

      <FlatList
        data={data}
        key={2}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: (insets.bottom || 0) + 16 },
        ]}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}

const RADIUS = 16;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f0f11', // Slightly lighter dark background
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    color: '#ff529f',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontStyle: 'italic',
  },
  liveTagContainer: {
    backgroundColor: '#ff529f',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
    transform: [{ rotate: '-5deg' }]
  },
  liveTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  appSubtitle: {
    display: 'none',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1c1c1e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff529f',
    borderWidth: 1.5,
    borderColor: '#1c1c1e',
  },
  balancePill: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: "#FDE68A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  balanceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(253, 230, 138, 0.3)',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  balanceText: {
    color: '#FDE68A',
    marginLeft: 6,
    fontWeight: '700',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 100, // Extra padding for bottom
  },
  columnWrapper: {
    justifyContent: 'space-around', // Center the larger items
  },
  cardWrapper: {
    flex: 1/2,
    marginBottom: 24,
    alignItems: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    width: '100%',
  },
  avatarContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#ff529f', // Pink border
    padding: 4, // Gap between image and border
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 82, 159, 0.5)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    backgroundColor: '#2c2c2e',
  },
  cardName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  viewerTextSmall: {
    color: '#9ca3af',
    fontSize: 12,
    textAlign: 'center',
  },
  liveBadgeSmall: {
    position: 'absolute',
    bottom: -8,
    alignSelf: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#0f0f11', // Match background to create "cutout" effect
  },
  liveTextSmall: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  // Keep banner styles
  bannerContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 100,
    shadowColor: "#ff529f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bannerGradient: { borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(255, 82, 159, 0.3)' },
  bannerContent: { flexDirection: 'row', alignItems: 'center' },
  bannerAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, borderWidth: 2, borderColor: '#ff529f' },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  bannerSubtitle: { color: '#ff529f', fontSize: 12, fontWeight: '600' },
  callIconContainer: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center' },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  loadingText: {
    color: '#ff529f',
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
  },
});
