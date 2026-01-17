import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, ScrollView, StyleSheet, Pressable, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ONLINE_URL = 'https://slayerintech.github.io/DekhoJi/docs/privacy-policy.html';

export default function PrivacyPolicyScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const openOnline = () => {
    Linking.openURL(ONLINE_URL).catch(() => {});
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={{ paddingHorizontal: 24, paddingTop: insets.top + 12, paddingBottom: 24 }}
      >
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800' }}>Privacy Policy</Text>
        <Text style={{ color: '#94a3b8', marginTop: 4, fontSize: 14 }}>Effective date: 26 Nov 2025</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
        <View style={styles.card}>
          <Text style={styles.text}>
            DekhoJi respects your privacy. This policy explains what information we collect, how we use it, and your choices. By using DekhoJi, you agree to this policy.
          </Text>
        </View>

        <Text style={styles.h2}>Information We Collect</Text>
        <View style={styles.card}>
          <BulletItem text="Account and basic profile details you provide in the app." />
          <BulletItem text="Device information (model, OS version, app version, language, country) for app functionality and diagnostics." />
          <BulletItem text="Usage data and analytics (screens viewed, feature usage, crash logs) to improve the app experience." />
          <BulletItem text="Payment-related status (successful purchase flags) via our payment provider; we do not store full payment card details." />
          <BulletItem text="Images, camera, microphone and notifications permissions when you choose features like video calling or alerts." />
        </View>

        <Text style={styles.h2}>How We Use Information</Text>
        <View style={styles.card}>
          <BulletItem text="To operate core features like chat, live rooms, and video call banners." />
          <BulletItem text="To personalize content (e.g., rotating profiles and message suggestions) and improve UI/UX." />
          <BulletItem text="To maintain security, prevent abuse, and debug issues." />
          <BulletItem text="To process purchases and provide customer support." />
        </View>

        <Text style={styles.h2}>Data Sharing</Text>
        <View style={styles.card}>
          <BulletItem text="Service providers: analytics, crash reporting, and payment processing to operate the app." />
          <BulletItem text="Legal compliance: we may disclose information when required by law or to protect rights and safety." />
          <BulletItem text="We do not sell your personal data." />
        </View>

        <Text style={styles.h2}>Retention & Security</Text>
        <View style={styles.card}>
          <BulletItem text="We retain data only for as long as needed for the purposes above." />
          <BulletItem text="We use reasonable technical and organizational measures to protect information." />
        </View>

        <Text style={styles.h2}>Your Choices</Text>
        <View style={styles.card}>
          <BulletItem text="You can manage permissions (camera, microphone, notifications) in your device settings." />
          <BulletItem text="You can request deletion of your account data via in‑app support." />
          <BulletItem text="Opt‑out of non‑essential analytics where applicable." />
        </View>

        <Text style={styles.h2}>Children’s Privacy</Text>
        <View style={styles.card}>
          <Text style={styles.text}>
            DekhoJi is not intended for children under the age of 13. We do not knowingly collect personal information from children.
          </Text>
        </View>

        <Text style={styles.h2}>International Transfers</Text>
        <View style={styles.card}>
          <Text style={styles.text}>
            Your information may be processed in countries other than your own. We take steps to ensure appropriate safeguards are in place.
          </Text>
        </View>

        <Text style={styles.h2}>Updates to This Policy</Text>
        <View style={styles.card}>
          <Text style={styles.text}>
            We may update this policy from time to time. Continued use of the app after changes means you accept the updated policy.
          </Text>
        </View>

        <Text style={styles.h2}>Contact</Text>
        <View style={styles.card}>
          <Text style={styles.text}>
            For privacy questions or requests, contact us via the in‑app support section.
          </Text>
        </View>

        <Pressable onPress={openOnline} style={{ marginTop: 32, alignItems: 'center' }}>
            <Text style={{ color: '#0ea5e9', fontSize: 14, textDecorationLine: 'underline' }}>View Online Version</Text>
        </Pressable>

        <Text style={{ textAlign: 'center', color: '#64748b', marginTop: 16, fontSize: 12 }}>
          © 2025 DekhoJi
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const BulletItem = ({ text }) => (
  <View style={{ flexDirection: 'row', marginBottom: 8 }}>
    <Text style={{ color: '#94a3b8', marginRight: 8, fontSize: 16 }}>•</Text>
    <Text style={styles.text}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  h2: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  text: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 24,
  },
});
