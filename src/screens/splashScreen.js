import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {width, height} from '../constants/wid_height';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/*<Image
        style={styles.splashlogo}
        source={require('../assets/images/logoicon.png')}
      />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  splashlogo: {
    resizeMode: 'center',

    width: width * 0.8,
    height: height * 0.5,
  },
});

export default SplashScreen;
