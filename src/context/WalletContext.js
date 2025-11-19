import React, { createContext, useContext, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const creditDiamonds = (count) => setDiamonds((d) => d + count);
  const consumeDiamonds = (count) => setDiamonds((d) => Math.max(0, d - count));

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