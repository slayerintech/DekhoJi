import React, { createContext, useContext, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [gender, setGender] = useState(null);
  const [user, setUser] = useState(null);
  const [diamonds, setDiamonds] = useState(0);
  const [liveRooms, setLiveRooms] = useState([]);

  React.useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('wallet');
      if (saved) {
        const parsed = JSON.parse(saved);
        setGender(parsed.gender ?? null);
        setUser(parsed.user ?? null);
        setDiamonds(parsed.diamonds ?? 0);
      }
    })();
  }, []);

  React.useEffect(() => {
    const persist = async () => {
      await AsyncStorage.setItem(
        'wallet',
        JSON.stringify({ gender, user, diamonds })
      );
    };
    persist();
  }, [gender, user, diamonds]);

  React.useEffect(() => {
    const syncUser = async () => {
      if (!user || !user.id) return;
      const ref = doc(db, 'users', user.id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setDiamonds(typeof data.diamonds === 'number' ? data.diamonds : 0);
      } else {
        await setDoc(ref, {
          name: user.name || '',
          email: user.email || '',
          avatar: user.avatar || '',
          diamonds: 0,
          createdAt: Date.now(),
        });
        setDiamonds(0);
      }
    };
    syncUser();
  }, [user]);

  const creditDiamonds = async (count) => {
    setDiamonds((d) => d + count);
    try {
      if (user && user.id) {
        const ref = doc(db, 'users', user.id);
        await updateDoc(ref, { diamonds: (diamonds + count) });
      }
    } catch {}
  };
  const consumeDiamonds = async (count) => {
    setDiamonds((d) => Math.max(0, d - count));
    try {
      if (user && user.id) {
        const ref = doc(db, 'users', user.id);
        const next = Math.max(0, diamonds - count);
        await updateDoc(ref, { diamonds: next });
      }
    } catch {}
  };

  const value = useMemo(
    () => ({
      gender,
      setGender,
      user,
      setUser,
      diamonds,
      creditDiamonds,
      consumeDiamonds,
      liveRooms,
      setLiveRooms,
    }),
    [gender, user, diamonds, liveRooms]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  return useContext(WalletContext);
}