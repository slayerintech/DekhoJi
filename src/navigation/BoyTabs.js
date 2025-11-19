import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import PurchaseScreen from '../screens/PurchaseScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export default function BoyTabs() {
  const insets = useSafeAreaInsets();
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
            Home: 'home',
            Wallet: 'diamond',
            Messages: 'chatbubbles',
            Profile: 'person',
          };
          const name = map[route.name] || 'ellipse';
          return <Ionicons name={name} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wallet" component={PurchaseScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}