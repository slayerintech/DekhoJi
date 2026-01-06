import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Vibration, Platform, AppState, PermissionsAndroid, ToastAndroid } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

const CallContext = createContext(null);

export function useCall() {
  return useContext(CallContext);
}

const girlImages = [
  require('../../assets/img1.jpeg'),
  require('../../assets/img3.jpeg'),
  require('../../assets/img4.jpeg'),
  require('../../assets/img5.jpeg'),
  require('../../assets/img6.jpeg'),
  require('../../assets/img7.jpeg'),
  require('../../assets/img8.jpeg'),
  require('../../assets/img9.jpeg'),
  require('../../assets/img10.jpeg'),
  require('../../assets/img11.jpeg'),
  require('../../assets/img12.jpeg'),
  require('../../assets/img13.jpeg'),
  require('../../assets/img14.jpeg'),
  require('../../assets/img15.jpeg'),
  require('../../assets/img16.jpeg'),
  require('../../assets/img17.jpeg'),
  require('../../assets/img18.jpeg'),
  require('../../assets/img19.jpeg'),
  require('../../assets/img20.jpeg'),
  require('../../assets/img21.jpeg'),
  require('../../assets/img22.jpeg'),
];

export function CallProvider({ children }) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [callerInfo, setCallerInfo] = useState({
    name: 'Priya Sharma',
    image: girlImages[0],
    status: 'Online',
    type: 'Video Call'
  });
  
  // Initialize with one default missed call
  const [callHistory, setCallHistory] = useState([
    {
      id: 'default-1',
      name: 'Anjali Gupta',
      image: girlImages[1],
      status: 'Missed Call',
      time: '2 min ago',
      type: 'missed'
    }
  ]);

  const soundObject = useRef(new Audio.Sound());
  const vibrationInterval = useRef(null);

  // Trigger a call automatically every 10 seconds
  useEffect(() => {
    let timer;
    if (!isCallActive && !isBusy) {
      timer = setTimeout(() => {
        startIncomingCall();
      }, 10000); // 10 seconds interval
    }
    return () => clearTimeout(timer);
  }, [isCallActive, isBusy]);

  const startIncomingCall = () => {
    // Pick a random caller
    const names = ['Priya', 'Neha', 'Riya', 'Sneha', 'Aisha'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomImg = girlImages[Math.floor(Math.random() * girlImages.length)];
    
    setCallerInfo({
      name: randomName,
      image: randomImg,
      status: 'Calling...',
      type: 'Video Call'
    });
    setIsCallActive(true);
  };

  const endCall = (status) => {
    stopRinging();
    setIsCallActive(false);

    // Add to history
    const newLog = {
      id: Date.now().toString(),
      name: callerInfo.name,
      image: callerInfo.image,
      status: status === 'missed' ? 'Missed Call' : 'Incoming Call',
      time: 'Just now',
      type: status
    };
    
    setCallHistory(prev => [newLog, ...prev]);
  };

  // Ringing Logic
  useEffect(() => {
    let timeout;
    if (isCallActive) {
      startRinging();
      // Auto-end call after 5 seconds
      timeout = setTimeout(() => {
        endCall('missed');
      }, 5000);
    } else {
      stopRinging();
    }
    return () => {
      stopRinging();
      clearTimeout(timeout);
    };
  }, [isCallActive]);

  const startRinging = async () => {
    console.log("Call Context: Starting Ringing");
    
    // Cancel any existing vibration first
    Vibration.cancel();

    // 1. Debug Vibration Loop (Maximum Power)
    const triggerAlert = async () => {
      try {
        console.log("Triggering Alert...");
        
        if (Platform.OS === 'android') {
          // Visual confirmation
          ToastAndroid.show("Ringing... (Check System Vibration Settings)", ToastAndroid.SHORT);
          
          // Pattern: Start immediately (0), Vibrate 800ms, Pause 200ms, Repeat
          // 'true' means loop this pattern until cancelled
          Vibration.vibrate([0, 800, 200], true); 
        } else {
           // iOS Fallback
           Vibration.vibrate();
           await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }

      } catch (e) {
        console.warn("Alert error:", e);
      }
    };

    // Trigger immediately
    triggerAlert();
    
    // We don't need setInterval for Android if we use the pattern loop (second arg = true)
    // But for safety/debug, we'll leave a simple log or iOS fallback interval
    if (Platform.OS === 'ios') {
        vibrationInterval.current = setInterval(triggerAlert, 1000);
    }

    // 2. Audio Setup (Restored to ensure App Focus)
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/ringtone.mp3'),
        { isLooping: true }
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  const stopRinging = async () => {
    console.log("Call Context: Stopping Ringing");
    try {
      await soundObject.current.stopAsync();
      await soundObject.current.unloadAsync();
    } catch (e) {}
    
    Vibration.cancel();
    if (vibrationInterval.current) {
      clearInterval(vibrationInterval.current);
      vibrationInterval.current = null;
    }
  };

  return (
    <CallContext.Provider value={{ isCallActive, callerInfo, callHistory, startIncomingCall, endCall, setIsBusy }}>
      {children}
    </CallContext.Provider>
  );
}
