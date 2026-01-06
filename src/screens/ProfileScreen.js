import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, setUser, diamonds, gender, currentPack, setShowDiamondSheet } = useWallet();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            try { await signOut(auth); } catch {}
            setUser(null);
            navigation.replace('Login');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}>
        
        {/* Header Profile Section */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <Image 
              source={{ uri: user?.avatar || 'https://i.pravatar.cc/300' }} 
              style={styles.avatar} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
              <Text style={styles.email}>{user?.email || 'No email linked'}</Text>
              <View style={styles.badgeContainer}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.badge}
                >
                  <Text style={styles.badgeText}>{currentPack || 'Free Member'}</Text>
                </LinearGradient>
              </View>
            </View>
          </View>
        </View>

        {/* Creator Section (Conditional) */}
        {gender === 'girl' && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>CREATOR STUDIO</Text>
            <View style={styles.sectionBody}>
              <Pressable 
                style={styles.row} 
                onPress={() => navigation.navigate('GoLive')}
              >
                <View style={[styles.iconContainer, { backgroundColor: 'rgba(233, 30, 99, 0.15)' }]}>
                  <Ionicons name="videocam" size={20} color="#e91e63" />
                </View>
                <Text style={[styles.rowLabel, { color: '#e91e63', fontWeight: '700' }]}>Go Live Now</Text>
                <Ionicons name="chevron-forward" size={20} color="#555" />
              </Pressable>
            </View>
          </View>
        )}

        {/* Account Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>ACCOUNT</Text>
          <View style={styles.sectionBody}>
            <Pressable style={styles.row} onPress={() => setShowDiamondSheet(true)}>
              <View style={[styles.iconContainer, { backgroundColor: '#FFD70020' }]}>
                <Ionicons name="wallet" size={20} color="#FFD700" />
              </View>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowLabel}>My Wallet</Text>
                <Text style={styles.rowValue}>{diamonds} Diamonds</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#555" />
            </Pressable>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>PREFERENCES</Text>
          <View style={styles.sectionBody}>
            <View style={styles.row}>
              <View style={[styles.iconContainer, { backgroundColor: '#4CAF5020' }]}>
                <Ionicons name="notifications" size={20} color="#4CAF50" />
              </View>
              <Text style={styles.rowLabel}>Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#3e3e3e", true: "#e91e63" }}
                thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
              />
            </View>

            <View style={styles.separator} />

            <Pressable style={styles.row}>
              <View style={[styles.iconContainer, { backgroundColor: '#9C27B020' }]}>
                <Ionicons name="globe" size={20} color="#9C27B0" />
              </View>
              <Text style={styles.rowLabel}>Language</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.rowValueText}>English</Text>
                <Ionicons name="chevron-forward" size={20} color="#555" style={{ marginLeft: 8 }} />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Support */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>SUPPORT</Text>
          <View style={styles.sectionBody}>
            <Pressable style={styles.row} onPress={() => navigation.navigate('Terms')}>
              <View style={[styles.iconContainer, { backgroundColor: '#607D8B20' }]}>
                <Ionicons name="document-text" size={20} color="#607D8B" />
              </View>
              <Text style={styles.rowLabel}>Terms & Conditions</Text>
              <Ionicons name="chevron-forward" size={20} color="#555" />
            </Pressable>

            <View style={styles.separator} />

            <Pressable style={styles.row} onPress={() => navigation.navigate('Privacy')}>
              <View style={[styles.iconContainer, { backgroundColor: '#607D8B20' }]}>
                <Ionicons name="shield-checkmark" size={20} color="#607D8B" />
              </View>
              <Text style={styles.rowLabel}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color="#555" />
            </Pressable>

             <View style={styles.separator} />

            <Pressable style={styles.row}>
              <View style={[styles.iconContainer, { backgroundColor: '#607D8B20' }]}>
                <Ionicons name="help-circle" size={20} color="#607D8B" />
              </View>
              <Text style={styles.rowLabel}>Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#555" />
            </Pressable>
          </View>
        </View>

        {/* Actions */}
        {!user?.isGuest && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionBody}>
            <Pressable style={styles.row} onPress={handleLogout}>
              <View style={[styles.iconContainer, { backgroundColor: '#F4433620' }]}>
                <Ionicons name="log-out" size={20} color="#F44336" />
              </View>
              <Text style={[styles.rowLabel, { color: '#F44336' }]}>Logout</Text>
            </Pressable>
          </View>
        </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  /* Header */
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#333',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  email: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  badgeContainer: {
    marginTop: 6,
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '800',
  },
  editBtn: {
    padding: 10,
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
  },
  /* Sections */
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  sectionBody: {
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 56,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rowLabel: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  rowTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  rowValue: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  rowValueText: {
    color: '#888',
    fontSize: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#2c2c2e',
    marginLeft: 64, // align with text start
  },
  versionText: {
    textAlign: 'center',
    color: '#444',
    fontSize: 12,
    marginBottom: 20,
  },
});
