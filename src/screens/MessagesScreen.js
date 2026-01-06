import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCall } from '../context/CallContext';
import { useWallet } from '../context/WalletContext';
import { LinearGradient } from 'expo-linear-gradient';

// Static images for "Active Now" section
const activeUsers = [
  { id: 'a1', name: 'Riya', image: require('../../assets/img4.jpeg') },
  { id: 'a2', name: 'Sonia', image: require('../../assets/img5.jpeg') },
  { id: 'a3', name: 'Pooja', image: require('../../assets/img6.jpeg') },
  { id: 'a4', name: 'Neha', image: require('../../assets/img7.jpeg') },
  { id: 'a5', name: 'Zara', image: require('../../assets/img8.jpeg') },
  { id: 'a6', name: 'Simran', image: require('../../assets/img9.jpeg') },
];

export default function MessagesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { callHistory } = useCall();
  const { setShowDiamondSheet } = useWallet();

  const renderOnlineUser = ({ item }) => (
    <Pressable style={styles.storyContainer} onPress={() => setShowDiamondSheet(true)}>
      <LinearGradient
        colors={['#e91e63', '#ff6b6b']}
        style={styles.storyRing}
      >
        <Image source={item.image} style={styles.storyAvatar} />
        <View style={styles.onlineBadge} />
      </LinearGradient>
      <Text style={styles.storyName} numberOfLines={1}>{item.name}</Text>
    </Pressable>
  );

  const renderItem = ({ item }) => {
    const isMissed = item.status === 'Missed Call';
    
    return (
      <View style={styles.callRow}>
        <View style={styles.avatarContainer}>
          <Image 
            source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
            style={styles.avatar} 
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.name, isMissed && styles.missedName]}>{item.name}</Text>
          <View style={styles.statusRow}>
            <MaterialCommunityIcons 
              name={isMissed ? "phone-missed" : "phone-incoming"} 
              size={16} 
              color={isMissed ? "#FF3B30" : "#25D366"} 
              style={{ marginRight: 4 }}
            />
            <Text style={styles.timeText}>
              {item.time}
            </Text>
          </View>
        </View>

        <Pressable 
          onPress={() => setShowDiamondSheet(true)}
          style={styles.callActionBtn}
        >
          <Ionicons name="videocam" size={22} color="#fff" />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b0b0c" />
      
      {/* Modern App Header */}
      <SafeAreaView edges={['top']} style={styles.headerArea}>
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.headerTitle}>Chats</Text>
            <Text style={styles.headerSubtitle}>{callHistory.length} recent calls</Text>
          </View>
          <View style={styles.headerIcons}>
            <Pressable style={styles.iconButton}>
               <Ionicons name="search-outline" size={24} color="#fff" />
            </Pressable>
            <Pressable style={styles.iconButton}>
               <Ionicons name="options-outline" size={24} color="#fff" />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <FlatList
        data={callHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
           <View>
             {/* Active Now Section */}
             <View style={styles.storiesSection}>
               <Text style={styles.sectionTitle}>Active Now</Text>
               <FlatList
                 horizontal
                 data={activeUsers}
                 renderItem={renderOnlineUser}
                 keyExtractor={item => item.id}
                 showsHorizontalScrollIndicator={false}
                 contentContainerStyle={styles.storiesList}
               />
             </View>

             {/* Recent Section Header */}
             <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Recent History</Text>
             </View>
           </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0c', // App Theme Background
  },
  headerArea: {
    backgroundColor: '#0b0b0c',
    paddingBottom: 10,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1d1d1f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 80,
  },
  storiesSection: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1d1d1f',
  },
  storiesList: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  storyRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#0b0b0c',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#22c55e', // Green for online
    borderWidth: 2,
    borderColor: '#0b0b0c',
  },
  storyName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 10,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingHorizontal: 20,
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#0b0b0c',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1d1d1f',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  missedName: {
    color: '#ff4757', // Softer red for dark mode
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#888',
    fontSize: 13,
    marginLeft: 6,
  },
  callActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1d1d1f',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
