import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function TermsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <LinearGradient colors={["#1a0208ff", "#19053aff", "#cb00a2ff"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingHorizontal: 16, paddingTop: insets.top + 12, paddingBottom: 12 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>Terms & Conditions</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Payments</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>All purchases are final and non-refundable. Please review packs and pricing before payment.</Text>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Live Availability</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>The app is new and live hosts may not always be available. If no live host is found, try again later.</Text>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Content Restrictions</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>Do not share or request pornographic or sexually explicit content. Any obscene, illegal, or exploitative material is strictly prohibited.</Text>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Usage</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>You must follow respectful behavior. Any misuse may result in account restrictions.</Text>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Privacy</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>Do not share sensitive information during chats. We strive to keep your data secure.</Text>
        </View>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Support</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>If payment issues occur, provide your UTR to support for verification and assistance.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}