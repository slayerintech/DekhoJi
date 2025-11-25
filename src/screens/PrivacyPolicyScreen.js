import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { ScrollView, Text, View } from 'react-native'

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <LinearGradient colors={["#1a0208ff", "#19053aff", "#cb00a2ff"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingHorizontal: 16, paddingTop: insets.top + 12, paddingBottom: 12 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>Privacy Policy</Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Overview</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>DekhoJi respects your privacy. This policy explains what data we collect, how we use it, and your choices.</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Information We Collect</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>Account data such as name, email, and avatar you provide. Usage data such as app interactions, session events, and device identifiers. Purchase data limited to products purchased and related receipts required to fulfill orders. We do not collect sensitive personal information.</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>How We Use Data</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>To provide and improve the service, sync your diamonds and profile, process purchases, prevent abuse, and comply with legal requirements. We may use aggregated and anonymized analytics to understand app performance.</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Payments</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>Digital goods are sold via Google Play Billing. We do not handle your card or UPI details. We store only the minimal purchase metadata necessary to deliver diamonds and support your account.</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Data Storage and Security</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>We use Firebase services and local storage to sync and persist your data. We apply reasonable safeguards to protect information. No method of transmission or storage is 100% secure, but we strive to use industry-standard practices.</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Sharing</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>We do not sell your personal data. We may share with service providers only for app functionality (for example, Firebase) under appropriate agreements and as required by law.</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Your Choices</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>You can update profile information in the app, sign out, or request deletion of your account. To opt out of analytics, you can disable ad personalization in your device account settings.</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Children</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>DekhoJi is intended for adults. Users must be 18+ and confirm age before using the app.</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Contact</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>For privacy questions or requests, contact support at support@dekhoji.app.</Text>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Updates</Text>
          <Text style={{ color: '#bbb', marginTop: 6 }}>We may update this policy. Continued use of the app means you accept the current policy. Last updated on the date of your app build.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}