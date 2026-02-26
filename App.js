import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, StatusBar, ImageBackground, SafeAreaView, Pressable, Vibration, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [displayDate, setDisplayDate] = useState('');
  const [displayTime, setDisplayTime] = useState('');
  const [overlayVisible, setOverlayVisible] = useState(false);

  // Timers references
  const timerOne = useRef(null);
  const timerTwo = useRef(null);

  useEffect(() => {
    // CALCULATION:
    // 2026 = 315,001
    // Offset = 315,001 - 2026 = 312,975
    const YEAR_OFFSET = 315001 - 2026; 

    const updateClock = () => {
      const now = new Date();
      // Get the parts separately so we can order them manually
      const weekday = now.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon"
      const month = now.toLocaleDateString('en-US', { month: 'short' });   // "Jan"
      const day = now.getDate();                                           // "5"
      const currentYear = now.getFullYear();
      
      const sapiensYear = currentYear + YEAR_OFFSET;
      
      // FORMAT: "Mon, 5 Jan 315001"
      setDisplayDate(`${weekday}, ${day} ${month} ${sapiensYear}`);
      
      setDisplayTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const stopTimers = () => {
    if (timerOne.current) clearTimeout(timerOne.current);
    if (timerTwo.current) clearTimeout(timerTwo.current);
    timerOne.current = null;
    timerTwo.current = null;
    Vibration.cancel();
  };

  const handlePressIn = () => {
    stopTimers();
    timerOne.current = setTimeout(() => {
      Vibration.vibrate(100); 
    }, 1000);

    timerTwo.current = setTimeout(() => {
      Vibration.vibrate(200); 
      setOverlayVisible(true);  
    }, 2000);
  };

  const handlePressOut = () => {
    stopTimers();
  };

  const closeOverlay = () => {
    setOverlayVisible(false);
    stopTimers();
  };

  const imageDetails = require('./assets/backdrop.png');

  return (
    <ImageBackground source={imageDetails} resizeMode="cover" style={styles.background}>
      <StatusBar style="light" />

      <Pressable 
        style={StyleSheet.absoluteFill} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      />

      <SafeAreaView style={styles.safeContainer} pointerEvents="box-none">
        
        <View style={styles.topHeader}>
          <Text style={styles.headerTitle}>HOMO SAPIENS ERA</Text>
        </View>

        {overlayVisible && (
          <Pressable style={styles.darkOverlay} onPress={closeOverlay}>
            <View style={styles.popupBox}>
              <Text style={styles.popupText}>
                The current year counting from the emergence of Homo sapiens (approx. 315,000 years ago). We are now in year 1 of the new millennium cycle.
              </Text>
              <Text style={styles.closeHint}>(Tap screen to close)</Text>
            </View>
          </Pressable>
        )}

        <View style={styles.bottomCardContainer}>
           <View style={styles.bottomCard}>
            <Text style={styles.label}>Current Date</Text>
            <Text style={styles.dateText}>{displayDate}</Text>
            <View style={styles.divider} />
            <Text style={styles.timeText}>{displayTime}</Text>
          </View>
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeContainer: {
    flex: 1,
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 20,
  },
  topHeader: {
    marginTop: 40, 
    alignItems: 'center',
    zIndex: 1, 
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900', 
    color: '#FFD700', 
    letterSpacing: 6, 
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, 
    backgroundColor: 'rgba(0, 0, 0, 0.85)', 
    zIndex: 50, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBox: {
    width: '85%',
    padding: 25,
    backgroundColor: '#1a1a1a', 
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD700', 
    alignItems: 'center',
    marginBottom: 150, 
  },
  popupText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  closeHint: {
    marginTop: 15,
    color: '#666',
    fontSize: 12,
  },
  bottomCardContainer: {
    width: '100%',
    alignItems: 'center',
    zIndex: 100, 
    marginBottom: 20,
  },
  bottomCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)', 
    width: '90%', 
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)', 
  },
  label: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 5,
  },
  dateText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    width: 40,
    backgroundColor: '#444',
    marginVertical: 10,
  },
  timeText: {
    color: '#FFD700', 
    fontSize: 28,
    fontFamily: 'Courier', 
    fontWeight: 'bold',
  },
});