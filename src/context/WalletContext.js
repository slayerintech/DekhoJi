import React, { createContext, useContext, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [gender, setGender] = useState(null);
  const [user, setUser] = useState(null);
  const [diamonds, setDiamonds] = useState(0);
  const [currentPack, setCurrentPack] = useState('Free Member');
  const [liveRooms, setLiveRooms] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(true);
  const [globalCallVisible, setGlobalCallVisible] = useState(false);
  const [globalCallIndex, setGlobalCallIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('wallet');
        if (saved) {
          const parsed = JSON.parse(saved);
          const u = parsed.user ?? null;
          setGender(parsed.gender ?? null);
          setUser(u);
          // Only restore diamonds/pack if user is logged in
          setDiamonds(u ? (parsed.diamonds ?? 0) : 0);
          setCurrentPack(u ? (parsed.currentPack ?? 'Free Member') : 'Free Member');
          setUnreadMessages(parsed.unreadMessages ?? true);
        }
      } catch (e) {
        // ignore error
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  React.useEffect(() => {
    const persist = async () => {
      await AsyncStorage.setItem(
        'wallet',
        JSON.stringify({ gender, user, diamonds, currentPack, unreadMessages })
      );
    };
    persist();
  }, [gender, user, diamonds, currentPack, unreadMessages]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!globalCallVisible && liveRooms && liveRooms.length > 0) {
        setGlobalCallIndex((i) => (i + 1) % liveRooms.length);
        setGlobalCallVisible(true);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [globalCallVisible, liveRooms]);

  React.useEffect(() => {
    if (globalCallVisible) {
      const t = setTimeout(() => setGlobalCallVisible(false), 90000);
      return () => clearTimeout(t);
    }
  }, [globalCallVisible]);

  React.useEffect(() => {
    if (globalCallVisible && liveRooms && liveRooms.length > 0) {
      const rotate = setInterval(() => {
        setGlobalCallIndex((i) => (i + 1) % liveRooms.length);
      }, 10000);
      return () => clearInterval(rotate);
    }
  }, [globalCallVisible, liveRooms]);

  React.useEffect(() => {
    const syncUser = async () => {
      if (!user || !user.id) {
        setDiamonds(0);
        setCurrentPack('Free Member');
        return;
      }
      const ref = doc(db, 'users', user.id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setDiamonds(typeof data.diamonds === 'number' ? data.diamonds : 0);
        setCurrentPack(data.currentPack || 'Free Member');
      } else {
        await setDoc(ref, {
          name: user.name || '',
          email: user.email || '',
          avatar: user.avatar || '',
          diamonds: 0,
          currentPack: 'Free Member',
          createdAt: Date.now(),
        });
        setDiamonds(0);
        setCurrentPack('Free Member');
      }
    };
    syncUser();
  }, [user]);

  const creditDiamonds = async (count, packName) => {
    setDiamonds((d) => d + count);
    if (packName) setCurrentPack(packName);
    try {
      if (user && user.id) {
        const ref = doc(db, 'users', user.id);
        const updateData = { diamonds: (diamonds + count) };
        if (packName) updateData.currentPack = packName;
        await updateDoc(ref, updateData);
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
      currentPack,
      creditDiamonds,
      consumeDiamonds,
      liveRooms,
      setLiveRooms,
      unreadMessages,
      setUnreadMessages,
      globalCallVisible,
      setGlobalCallVisible,
      globalCallIndex,
      setGlobalCallIndex,
      isLoading,
    }),
    [gender, user, diamonds, liveRooms, unreadMessages, globalCallVisible, globalCallIndex, isLoading]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  return useContext(WalletContext);
}
