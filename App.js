import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WalletProvider, useWallet } from './src/context/WalletContext';
import { CallProvider } from './src/context/CallContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import GlobalCallUI from './src/components/GlobalCallUI';
import DiamondSheet from './src/components/DiamondSheet';
import { navigationRef } from './src/navigation/navigationRef';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import OnboardingScreen from './src/screens/OnboardingScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import GoLiveScreen from './src/screens/GoLiveScreen';
import LiveWatchScreen from './src/screens/LiveWatchScreen';
import WaitingScreen from './src/screens/WaitingScreen';
import BoyTabs from './src/navigation/BoyTabs';
import TermsScreen from './src/screens/TermsScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import AgeGateScreen from './src/screens/AgeGateScreen';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, isLoading } = useWallet();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' }}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Home" component={BoyTabs} />
            <Stack.Screen name="GoLive" component={GoLiveScreen} />
            <Stack.Screen name="LiveWatch" component={LiveWatchScreen} />
            <Stack.Screen name="Waiting" component={WaitingScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyPolicyScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="AgeGate" component={AgeGateScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyPolicyScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <CallProvider>
        <SafeAreaProvider>
          <RootNavigator />
          <GlobalCallUI />
          <DiamondSheet />
        </SafeAreaProvider>
      </CallProvider>
    </WalletProvider>
  );
}
