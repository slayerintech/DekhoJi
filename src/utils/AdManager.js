import Constants from 'expo-constants';
import { View, Text } from 'react-native';

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

let mobileAds = { initialize: () => Promise.resolve() }; // Default safe implementation (Object)
let BannerAd = () => null; // Default safe implementation
let BannerAdSize = {};
let InterstitialAd = { createForAdRequest: () => ({ load: () => {}, show: () => {}, addAdEventListener: () => () => {} }) };
let AdEventType = {};
let TestIds = {};

if (isExpoGo) {
  console.log('Running in Expo Go - AdMob Disabled (Native module not supported)');

  mobileAds = {
    initialize: () => Promise.resolve([{ status: 'mocked', description: 'Expo Go Mock' }]),
  };

  AdEventType = {
    LOADED: 'loaded',
    ERROR: 'error',
    CLOSED: 'closed',
    CLICKED: 'clicked',
    OPENED: 'opened',
  };

  InterstitialAd = {
    createForAdRequest: () => ({
      load: () => console.log('Ad load mocked in Expo Go'),
      show: () => {
        console.log('Ad show mocked in Expo Go');
        return Promise.resolve();
      },
      addAdEventListener: (event, handler) => {
        if (event === AdEventType.LOADED) {
          // Simulate ad loading after a short delay
          setTimeout(handler, 1000);
        }
        return () => {};
      },
    }),
  };

  TestIds = {
    INTERSTITIAL: 'mock-interstitial',
    BANNER: 'mock-banner',
  };

  BannerAd = () => (
    <View style={{ padding: 10, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', minHeight: 50 }}>
      <Text style={{ color: '#aaa', fontSize: 12 }}>Ads not supported in Expo Go</Text>
    </View>
  );

  BannerAdSize = {
    SMART_BANNER: 'SMART_BANNER',
    BANNER: 'BANNER',
    FULL_BANNER: 'FULL_BANNER',
    LARGE_BANNER: 'LARGE_BANNER',
    LEADERBOARD: 'LEADERBOARD',
    MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  };

} else {
  // Real implementation for Production / Development Builds
  try {
    const rnAds = require('react-native-google-mobile-ads');
    mobileAds = rnAds.default;
    InterstitialAd = rnAds.InterstitialAd;
    AdEventType = rnAds.AdEventType;
    TestIds = rnAds.TestIds;
    BannerAd = rnAds.BannerAd;
    BannerAdSize = rnAds.BannerAdSize;
  } catch (error) {
    console.error('Failed to require react-native-google-mobile-ads', error);
  }
}

export {
  mobileAds,
  InterstitialAd,
  AdEventType,
  TestIds,
  BannerAd,
  BannerAdSize,
  isExpoGo
};
