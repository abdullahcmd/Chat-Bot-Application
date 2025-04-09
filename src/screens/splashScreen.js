import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Text, Animated } from 'react-native';
import { width, height } from '../constants/wid_height';

const LoadingAnimation = () => {
  // Create three Animated.Values for each circle
  const animation1 = useRef(new Animated.Value(0)).current;
  const animation2 = useRef(new Animated.Value(0)).current;
  const animation3 = useRef(new Animated.Value(0)).current;

  // Function to loop an animation sequence with a delay
  const startAnimation = (animation, delay) => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false, // Required since we're animating backgroundColor
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startAnimation(animation1, 0);
    startAnimation(animation2, 250);
    startAnimation(animation3, 500);
  }, []);

  // Interpolate the animated value to change the circle color
  const getCircleColor = (animation) =>
    animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['#ccc', '#333'], // Light gray to dark gray
    });

  return (
    <View style={styles.circlesContainer}>
      <Animated.View style={[styles.circle, { backgroundColor: getCircleColor(animation1) }]} />
      <Animated.View style={[styles.circle, { backgroundColor: getCircleColor(animation2) }]} />
      <Animated.View style={[styles.circle, { backgroundColor: getCircleColor(animation3) }]} />
    </View>
  );
};

const SplashScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/New.png')}
          style={{
            height: height * 0.22,
            marginTop: height * 0.2,
            width: width * 0.55,
          }}
        />
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            marginBottom: height * 0.13,
          }}
        >
          Your Trusted Farming Assistant
        </Text>
      </View>
      <View style={{justifyContent: 'center', alignItems: 'center', marginTop: height * 0.2}}>
      <LoadingAnimation />
      <Text style={styles.LogoHeading}>Loading ...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    borderEndEndRadius: 160,
    borderBottomLeftRadius: 160,
    backgroundColor: '#FFEBA9',
  },
  LogoHeading: {
    textAlign: 'center',
    fontSize: 17,
  },
  circlesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 7.5,
    marginHorizontal: 5,
  },
});

export default SplashScreen;
