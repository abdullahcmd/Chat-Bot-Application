import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { colors } from '../../themes/colors';
import {width,height} from '../../constants/wid_height';
import { COLORS } from '../../constants';

const Arrow = ({navigation}) => {
  return (
    <Icon
      name="arrowleft"
      size={30}
      color={COLORS.black}
      style={{
        position: 'absolute',
        left: 20,
        top: 20,
        zIndex: 1,
      }}
      onPress={() => navigation.goBack()}
    />
  );
};
export default Arrow;