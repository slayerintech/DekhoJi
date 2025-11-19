import React, { useEffect } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../context/WalletContext';

const baseNames = [
  'Priya', 'Aisha', 'Neha', 'Rani', 'Anjali', 'Pooja', 'Kiran', 'Sunita', 'Sapna', 'Nisha',
  'Shreya', 'Aparna', 'Divya', 'Ritika', 'Meena', 'Komal', 'Sneha', 'Isha', 'Rupal', 'Juhi',
];
const surnames = ['Sharma', 'Kumari', 'Patel', 'Kaur', 'Das', 'Reddy', 'Joshi', 'Pandey', 'Verma', 'Gupta'];
const profiles = Array.from({ length: 50 }).map((_, i) => {
  const first = baseNames[i % baseNames.length];
  const last = surnames[i % surnames.length];
  const name = `${first} ${last}`;
  const live = i % 3 !== 0;
  return {
    id: String(i + 1),
    name,
    img: `https://loremflickr.com/640/840/indian,woman?lock=${i + 1}`,
    live,
  };
});

function ProfileCard({ item, onPress }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ flex: 1, margin: 8, borderRadius: 16, overflow: 'hidden', backgroundColor: '#111', transform: [{ scale: pressed ? 0.98 : 1 }], shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } })}>
      {failed ? (
        <LinearGradient colors={["#111827", "#1f2937"]} style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff', opacity: 0.8 }}>Image unavailable</Text>
        </LinearGradient>
      ) : (
        <Image source={{ uri: item.img }} style={{ height: 220 }} onError={() => setFailed(true)} />
      )}
      <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: item.live ? '#e11d48' : '#374151', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }}>
        <Text style={{ color: '#fff', fontWeight: '800', textShadowColor: 'rgba(255,255,255,0.6)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 }}>{item.live ? 'LIVE' : 'OFFLINE'}</Text>
      </View>
      <View style={{ padding: 12 }}>
        <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>{item.name}</Text>
        <Text style={{ color: '#bbb' }}>{item.live ? 'Tap to join' : 'Check later'}</Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }) {
  const { diamonds, setLiveRooms } = useWallet();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setLiveRooms(profiles.filter((p) => p.live));
  }, [setLiveRooms]);

  const renderItem = ({ item }) => (
    <ProfileCard item={item} onPress={() => navigation.navigate('LiveWatch', { profile: item })} />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      <LinearGradient colors={["#ef4770", "#7c3aed", "#1f2937"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingHorizontal: 16, paddingTop: insets.top + 12, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 26, fontWeight: '800' }}>DekhoJi Live</Text>
          <Pressable onPress={() => navigation.navigate('Purchase')} style={{ backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16 }}>
            <Text style={{ color: '#fff' }}>💎 {diamonds}</Text>
          </Pressable>
        </View>
      </LinearGradient>
      <FlatList
        data={profiles}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 8, paddingBottom: insets.bottom + 8 }}
      />
    </SafeAreaView>
  );
}