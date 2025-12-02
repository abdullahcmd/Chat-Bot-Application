import React from 'react';

import {FontAwesome} from '@react-native-vector-icons/fontawesome';

const Arrow = ({navigation}) => {
  return (
    <>
      <FontAwesome
        name="backward"
        size={30}
        color="black"
        style={{
          position: 'absolute',
          left: 20,
          top: 20,
          zIndex: 1,
        }}
        onPress={() => navigation.goBack()}
      />
    </>
  );
};
export default Arrow;
