import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useWallet } from '../context/WalletContext';

const options = [
  { minutes: 5, diamonds: 50, price: 299 },
  { minutes: 10, diamonds: 100, price: 499 },
  { minutes: 20, diamonds: 200, price: 899 },
  { minutes: 30, diamonds: 300, price: 1299 },
  { minutes: 60, diamonds: 600, price: 2299 },
];

export default function LiveWatchScreen({ navigation, route }) {
  const { profile } = route.params;
  const { diamonds, consumeDiamonds } = useWallet();
  const [selected, setSelected] = useState(options[0]);
  const [inSession, setInSession] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!profile?.live) navigation.replace('Waiting');
    }, 60000);
    return () => clearTimeout(timer);
  }, [navigation, profile]);

  const join = () => {
    if (diamonds < selected.diamonds) {
      Alert.alert('Not enough diamonds', 'Please purchase more to continue.', [
        { text: 'Buy diamonds', onPress: () => navigation.navigate('Purchase', { from: 'LiveWatch' }) },
        { text: 'Cancel' },
      ]);
      return;
    }
    consumeDiamonds(selected.diamonds);
    setInSession(true);
    setRemaining(selected.minutes * 60);
  };

  useEffect(() => {
    if (!inSession) return;
    const tick = setInterval(() => {
      setRemaining((r) => {
        const v = r - 1;
        if (v <= 0) {
          clearInterval(tick);
          Alert.alert('Session ended', 'Your time has finished.');
          setInSession(false);
        }
        return v;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [inSession]);

  const [failed, setFailed] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a0a' }}>
      {!inSession ? (
        <>
          {failed ? (
            <LinearGradient colors={["#111827", "#1f2937"]} style={{ height: 320, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#fff', opacity: 0.8 }}>Image unavailable</Text>
            </LinearGradient>
          ) : (
            <Image source={{ uri: profile.img }} style={{ height: 320 }} onError={() => setFailed(true)} />
          )}
          <View style={{ padding: 16 }}>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>{profile.name}</Text>
            <Text style={{ color: '#bbb', marginBottom: 12 }}>Select duration</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {options.map((opt) => (
                <Pressable
                  key={opt.minutes}
                  onPress={() => setSelected(opt)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: selected.minutes === opt.minutes ? '#e91e63' : '#333',
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: '#fff' }}>{opt.minutes}m • 💎{opt.diamonds} • ₹{opt.price}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={join} style={{ backgroundColor: '#e91e63', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Join Live</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View style={{ flex: 1 }}>
          {failed ? (
            <LinearGradient colors={["#111827", "#1f2937"]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#fff', opacity: 0.8 }}>Image unavailable</Text>
            </LinearGradient>
          ) : (
            <Image source={{ uri: profile.img }} style={{ flex: 1 }} onError={() => setFailed(true)} />
          )}
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: insets.bottom + 12, paddingTop: 16 }}>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>{profile.name}</Text>
            <Text style={{ color: '#fff' }}>Time left: {Math.floor(remaining / 60)}:{('0' + (remaining % 60)).slice(-2)}</Text>
            <Pressable onPress={() => setInSession(false)} style={{ backgroundColor: '#e91e63', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 12 }}>
              <Text style={{ color: '#fff' }}>End Session</Text>
            </Pressable>
          </LinearGradient>
        </View>
      )}
    </SafeAreaView>
  );
}