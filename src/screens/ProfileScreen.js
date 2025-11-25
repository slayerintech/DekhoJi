import React from 'react';
import { Pressable, Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Or react-native-vector-icons
import { LinearGradient } from 'expo-linear-gradient'; // Or react-native-linear-gradient
import { useWallet } from '../context/WalletContext';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { gender, setGender, user, setUser, diamonds } = useWallet();

  const select = (g) => setGender(g);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        
        {/* --- Header Section --- */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {/* Placeholder Avatar - Replace uri with user.avatar if available */}
            <Image 
              source={{ uri: user?.avatar || 'https://i.pravatar.cc/300' }} 
              style={styles.avatar} 
            />
            <Pressable style={styles.editBadge} onPress={() => console.log("Edit Avatar")}>
              <Ionicons name="camera" size={14} color="#fff" />
            </Pressable>
          </View>
          
          <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.userHandle}>{user?.email || ''}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balancePill}>
              <Ionicons name="diamond" size={16} color="#FDE68A" />
              <Text style={styles.balanceText}>{diamonds}</Text>
            </View>
          </View>

          <Pressable style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* --- Gender Section --- */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identity</Text>
          <View style={styles.genderRow}>
            
            <Pressable 
              onPress={() => select('boy')} 
              style={[styles.genderCard, gender === 'boy' && styles.genderCardSelected]}
            >
              <View style={[styles.iconCircle, gender === 'boy' && { backgroundColor: 'rgba(41, 182, 246, 0.2)' }]}>
                <Ionicons name="male" size={24} color={gender === 'boy' ? '#29b6f6' : '#666'} />
              </View>
              <Text style={[styles.genderText, gender === 'boy' && { color: '#29b6f6' }]}>Boy</Text>
              {gender === 'boy' && <Ionicons name="checkmark-circle" size={20} color="#29b6f6" style={styles.checkIcon} />}
            </Pressable>

            <Pressable 
              onPress={() => select('girl')} 
              style={[styles.genderCard, gender === 'girl' && styles.genderCardSelected]}
            >
               <View style={[styles.iconCircle, gender === 'girl' && { backgroundColor: 'rgba(233, 30, 99, 0.2)' }]}>
                <Ionicons name="female" size={24} color={gender === 'girl' ? '#e91e63' : '#666'} />
              </View>
              <Text style={[styles.genderText, gender === 'girl' && { color: '#e91e63' }]}>Girl</Text>
              {gender === 'girl' && <Ionicons name="checkmark-circle" size={20} color="#e91e63" style={styles.checkIcon} />}
            </Pressable>

          </View>
        </View>

        {/* --- Actions Section --- */}
        <View style={styles.section}>
          {gender === 'girl' && (
            <Pressable onPress={() => navigation.navigate('GoLive')}>
              <LinearGradient
                colors={['#9c27b0', '#e91e63']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.goLiveButton}
              >
                <Ionicons name="videocam" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.goLiveText}>Go Live Now</Text>
              </LinearGradient>
            </Pressable>
          )}

          {/* Menu List */}
          <View style={styles.menuContainer}>
            <MenuItem 
              icon="document-text-outline" 
              title="Terms & Conditions" 
              onPress={() => navigation.navigate('Terms')} 
            />
            <MenuItem 
              icon="shield-checkmark-outline" 
              title="Privacy Policy" 
              onPress={() => navigation.navigate('Privacy')} 
              hideBorder
            />
          </View>

          <Pressable style={styles.primaryButton} onPress={async () => { try { await signOut(auth); } catch {} setUser(null); navigation.replace('Login'); }}>
            <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryButtonText}>Logout</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// Helper Component for Menu Items
const MenuItem = ({ icon, title, onPress, hideBorder }) => (
  <Pressable onPress={onPress} style={[styles.menuItem, !hideBorder && styles.menuItemBorder]}>
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon} size={20} color="#bbb" />
      <Text style={styles.menuItemText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#555" />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    paddingBottom: 0,
  },
  /* Header Styles */
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#1c1c1c',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#e91e63',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0a0a0a',
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  userHandle: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  editProfileBtn: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#1c1c1c',
    borderWidth: 1,
    borderColor: '#333',
  },
  editProfileText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  /* Section Styles */
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  /* Gender Styles */
  genderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderCard: {
    flex: 0.48,
    backgroundColor: '#1c1c1c',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  genderCardSelected: {
    borderColor: '#333',
    backgroundColor: '#252525',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2d2d2d',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  genderText: {
    color: '#888',
    fontWeight: '600',
    fontSize: 16,
  },
  checkIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  /* Action Buttons */
  goLiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#e91e63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  goLiveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  /* Menu List */
  menuContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1c1c1c',
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: '#eee',
    fontSize: 15,
    marginLeft: 12,
  },
  balanceRow: { marginTop: 12 },
  balancePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1c1c1c', borderWidth: 1, borderColor: '#333', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  balanceText: { color: '#fff', fontWeight: '700', marginLeft: 6 },
  primaryButton: {
    marginTop: 24,
    backgroundColor: '#e91e63',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  }
});