import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WalletProvider } from './src/context/WalletContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import GoLiveScreen from './src/screens/GoLiveScreen';
import LiveWatchScreen from './src/screens/LiveWatchScreen';
import PurchaseScreen from './src/screens/PurchaseScreen';
import WaitingScreen from './src/screens/WaitingScreen';
import BoyTabs from './src/navigation/BoyTabs';
import TermsScreen from './src/screens/TermsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <WalletProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={BoyTabs} />
            <Stack.Screen name="GoLive" component={GoLiveScreen} />
            <Stack.Screen name="LiveWatch" component={LiveWatchScreen} />
            <Stack.Screen name="Purchase" component={PurchaseScreen} />
            <Stack.Screen name="Waiting" component={WaitingScreen} />
            <Stack.Screen name="Terms" component={TermsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </WalletProvider>
  );
}
