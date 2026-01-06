import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform, AppState } from 'react-native';

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
      // Auto-end call after 10 seconds
      timeout = setTimeout(() => {
        endCall('missed');
      }, 10000);
    } else {
      stopRinging();
    }
    return () => {
      stopRinging();
      clearTimeout(timeout);
    };
  }, [isCallActive]);

  const startRinging = async () => {
    // Audio and Vibration removed
  };

  const stopRinging = async () => {
    // Audio and Vibration removed
  };

  return (
    <CallContext.Provider value={{ isCallActive, callerInfo, callHistory, startIncomingCall, endCall, setIsBusy }}>
      {children}
    </CallContext.Provider>
  );
}
