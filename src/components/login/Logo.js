import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { height, width } from '../../constants/wid_height';
import Icon from 'react-native-vector-icons/FontAwesome';

const UpdatedInput = ({ 
  placeholderText, 
  onInputChanged, 
  errorText, 
  id, 
  placeholderTextColor, 
  IconName 
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        selectionColor="black"
        
        // Wrap the callback to pass both id and text
        onChangeText={(text) => onInputChanged(id, text)}
        placeholder={placeholderText}
        placeholderTextColor="#9c9a9a"
      />
      <Icon style={styles.logo} name={IconName} size={25} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    height: height * 0.075,
    backgroundColor: 'white',
    margin: height * 0.01,
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: height * 0.075,
    color: 'black',
    paddingLeft: width * 0.04,
  },
  logo: {
    alignSelf: 'center',
    paddingRight: width * 0.04,
  }
});

export default UpdatedInput;
