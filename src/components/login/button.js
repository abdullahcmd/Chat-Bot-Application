import React from 'react';
import { View, StyleSheet, TouchableOpacity,Text, ActivityIndicator } from 'react-native';
import { height, width } from '../../constants/wid_height';


const LoginButton = ({text,isLoading,onPress}) => {
  return (
    <TouchableOpacity style={styles.container} isLoading ={isLoading} onPress={onPress}>
        {isLoading ?(  <ActivityIndicator size="small" color="#fff" />):(
        <Text style={styles.text}>{text}</Text>)}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
   width:width*0.85,
   height:height*0.065,
   margin:height*0.02,
   backgroundColor: '#edc71f',
   borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default LoginButton;