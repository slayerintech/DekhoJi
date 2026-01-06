import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Switch, Alert, Share } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { LinearGradient } from 'expo-linear-gradient';

const SettingItem = ({ icon, color, label, value, onPress, isSwitch, switchValue, onSwitchChange, showChevron = true }) => (
  <Pressable 
    style={({ pressed }) => [styles.row, pressed && !isSwitch && { backgroundColor: '#2c2c2e' }]} 
    onPress={isSwitch ? null : onPress}
  >
    <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <View style={styles.rowContent}>
      <Text style={styles.rowLabel}>{label}</Text>
      {value && <Text style={styles.rowValue}>{value}</Text>}
    </View>
    {isSwitch ? (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: "#3e3e3e", true: "#e91e63" }}
        thumbColor={switchValue ? "#fff" : "#f4f3f4"}
      />
    ) : (
      showChevron && <Ionicons name="chevron-forward" size={20} color="#555" />
    )}
  </Pressable>
);

const SectionHeader = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, setUser, diamonds, gender, currentPack, setShowDiamondSheet } = useWallet();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

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

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Check out DekhoJi App! Watch live streams and connect with friends.',
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}>
        
        {/* Header Profile Section */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrapper}>
                <Image 
                source={{ uri: user?.avatar || 'https://i.pravatar.cc/300' }} 
                style={styles.avatar} 
                />
                <View style={styles.editBadge}>
                    <Ionicons name="pencil" size={12} color="#fff" />
                </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
              <Text style={styles.email}>{user?.email || 'No email linked'}</Text>
              <View style={styles.badgeContainer}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  start={{x: 0, y: 0}} end={{x: 1, y: 0}}
                  style={styles.badge}
                >
                  <Ionicons name="star" size={10} color="#fff" style={{marginRight: 4}} />
                  <Text style={styles.badgeText}>{currentPack || 'Free Member'}</Text>
                </LinearGradient>
              </View>
            </View>
          </View>
          
          {/* Stats Row */}
          <View style={styles.statsRow}>
             <View style={styles.statItem}>
                 <Text style={styles.statValue}>0</Text>
                 <Text style={styles.statLabel}>Following</Text>
             </View>
             <View style={styles.statDivider} />
             <View style={styles.statItem}>
                 <Text style={styles.statValue}>0</Text>
                 <Text style={styles.statLabel}>Followers</Text>
             </View>
             <View style={styles.statDivider} />
             <View style={styles.statItem}>
                 <Text style={styles.statValue}>Level 1</Text>
                 <Text style={styles.statLabel}>Status</Text>
             </View>
          </View>
        </View>

        {/* Creator Section (Conditional) */}
        {gender === 'girl' && (
          <View style={styles.sectionContainer}>
            <SectionHeader title="CREATOR STUDIO" />
            <View style={styles.sectionBody}>
                <SettingItem 
                    icon="videocam" 
                    color="#e91e63" 
                    label="Go Live Now" 
                    onPress={() => navigation.navigate('GoLive')} 
                />
                <View style={styles.separator} />
                <SettingItem 
                    icon="stats-chart" 
                    color="#e91e63" 
                    label="Analytics" 
                    onPress={() => {}} 
                />
            </View>
          </View>
        )}

        {/* Wallet Section */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="WALLET & EARNINGS" />
          <View style={styles.sectionBody}>
            <SettingItem 
                icon="wallet" 
                color="#FFD700" 
                label="My Wallet" 
                value={`${diamonds} Diamonds`}
                onPress={() => setShowDiamondSheet(true)} 
            />
            <View style={styles.separator} />
            <SettingItem 
                icon="gift" 
                color="#FF9800" 
                label="Refer & Earn" 
                value="Get Free Diamonds"
                onPress={handleShare} 
            />
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="APP SETTINGS" />
          <View style={styles.sectionBody}>
            <SettingItem 
                icon="notifications" 
                color="#4CAF50" 
                label="Push Notifications" 
                isSwitch 
                switchValue={notificationsEnabled}
                onSwitchChange={setNotificationsEnabled}
            />
            <View style={styles.separator} />
            <SettingItem 
                icon="cellular" 
                color="#2196F3" 
                label="Data Saver" 
                isSwitch 
                switchValue={dataSaver}
                onSwitchChange={setDataSaver}
            />
            <View style={styles.separator} />
            <SettingItem 
                icon="play-circle" 
                color="#9C27B0" 
                label="Auto-Play Videos" 
                isSwitch 
                switchValue={autoplay}
                onSwitchChange={setAutoplay}
            />
            <View style={styles.separator} />
             <SettingItem 
                icon="globe" 
                color="#00BCD4" 
                label="Language" 
                value="English"
                onPress={() => {}} 
            />
          </View>
        </View>

        {/* Security */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="SECURITY & PRIVACY" />
          <View style={styles.sectionBody}>
             <SettingItem 
                icon="lock-closed" 
                color="#607D8B" 
                label="Change Password" 
                onPress={() => {}} 
            />
             <View style={styles.separator} />
             <SettingItem 
                icon="hand-left" 
                color="#F44336" 
                label="Blocked Users" 
                onPress={() => {}} 
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="SUPPORT & LEGAL" />
          <View style={styles.sectionBody}>
             <SettingItem 
                icon="help-circle" 
                color="#8BC34A" 
                label="Help Center" 
                onPress={() => {}} 
            />
             <View style={styles.separator} />
             <SettingItem 
                icon="document-text" 
                color="#9E9E9E" 
                label="Terms of Service" 
                onPress={() => navigation.navigate('Terms')} 
            />
             <View style={styles.separator} />
             <SettingItem 
                icon="shield-checkmark" 
                color="#9E9E9E" 
                label="Privacy Policy" 
                onPress={() => navigation.navigate('Privacy')} 
            />
             <View style={styles.separator} />
             <SettingItem 
                icon="information-circle" 
                color="#9E9E9E" 
                label="About DekhoJi" 
                value="v1.0.0"
                onPress={() => {}} 
            />
          </View>
        </View>

        {/* Logout */}
        {!user?.isGuest && (
        <View style={[styles.sectionContainer, { marginTop: 20 }]}>
            <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out" size={20} color="#fff" style={{marginRight: 8}} />
                <Text style={styles.logoutText}>Log Out</Text>
            </Pressable>
            <Text style={styles.versionText}>DekhoJi App v1.0.0 (Build 102)</Text>
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
      position: 'relative',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#e91e63',
  },
  editBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: '#e91e63',
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#1c1c1e',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#2c2c2e',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 8,
  },
  statItem: {
      flex: 1,
      alignItems: 'center',
  },
  statValue: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
  statLabel: {
      color: '#888',
      fontSize: 11,
      marginTop: 2,
  },
  statDivider: {
      width: 1,
      backgroundColor: '#3a3a3c',
      height: '80%',
      alignSelf: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    color: '#888',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 12,
    letterSpacing: 1,
  },
  sectionBody: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
      flex: 1,
      marginLeft: 16,
  },
  rowLabel: {
    color: '#fff',
    fontSize: 16,
  },
  rowValue: {
      color: '#888',
      fontSize: 14,
      marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#2c2c2e',
    marginLeft: 68,
  },
  logoutButton: {
      backgroundColor: '#e91e63',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 16,
      marginBottom: 16,
  },
  logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
  },
  versionText: {
      color: '#555',
      textAlign: 'center',
      fontSize: 12,
  },
});
