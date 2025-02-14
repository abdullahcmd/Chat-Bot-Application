import React, { useState } from 'react';
import 'react-native-gesture-handler'; 
import 'react-native-reanimated'; 
import SplashScreen from './src/screens/splashScreen';
import 'react-native-gesture-handler'

import { FONTS } from './src/constants/fonts'
import { Ionicons} from 'react-native-vector-icons'
import BottomTabNavigation from './src/navigations/BottomTabNavigation'
import AppNavigation from './src/navigations/AppNavigation';

const App = () => {
  const[splash,setSplash]=useState(true);
 

return(
 <AppNavigation/>
      
)
};

export default App;

{/*setTimeout(()=>
    setSplash(false)
,2000);

  return <>{splash ?<SplashScreen /> :}</>;*/}