import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import {width, height} from '../constants/wid_height';

const SplashScreen = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
    <View style={styles.container}>
     <Image
                 source={require('../assets/images/BlackLogo.png')}
                 style={{
                   height: height * 0.15,
                   marginTop: height * 0.2,
                 
                   width: width * 0.5,
                 }}
               />
               <Text style={styles.LogoHeading}>FarmerGist</Text>
                  <Text
                           style={{
                               fontSize: 18,
                               fontWeight:'600',
                               marginTop: height * 0.02,
                               marginBottom: height * 0.15,
                           }}>
                           Your Trusted Farming Assistant
                         </Text>
     
      
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
   
    justifyContent: 'center',
    borderEndEndRadius: 300,
    borderBottomLeftRadius: 300,
    alignItems: 'center',
    backgroundColor: '#fff9d1',
  },
  splashlogo: {
    resizeMode: 'center',

    width: width * 0.8,
    height: height * 0.5,
  },
  LogoHeading: {
    fontSize: 40,
    fontWeight: 'bold',
   
  },
});

export default SplashScreen;
