import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useWallet } from '../context/WalletContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export default function BoyTabs() {
  const insets = useSafeAreaInsets();
  const { unreadMessages } = useWallet();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#0b0b0c', borderTopColor: '#1d1d1f', paddingBottom: insets.bottom ? 6 : 0, height: 60 + (insets.bottom ? 6 : 0) },
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: { fontSize: 12, marginTop: -2 },
        tabBarIcon: ({ color, size }) => {
          const map = {
            Feed: 'home',
            Wallet: 'diamond',
            Chats: 'chatbubbles',
            Settings: 'settings',
          };
          const name = map[route.name] || 'ellipse';
          if (route.name === 'Chats' && unreadMessages) {
            return (
              <View style={{ width: size + 8, height: size + 8 }}>
                <Ionicons name={name} color={color} size={size} />
                <View style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' }} />
              </View>
            );
          }
          return <Ionicons name={name} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Feed" component={HomeScreen} />
      <Tab.Screen name="Chats" component={MessagesScreen} />
      <Tab.Screen name="Settings" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
