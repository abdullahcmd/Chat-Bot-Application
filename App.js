import React, { useState } from 'react';

import SplashScreen from './src/screens/splashScreen';
import { Login } from './src/screens';
import { Text } from 'react-native';

const App = () => {
  const[splash,setSplash]=useState(true);
setTimeout(()=>
    setSplash(false)
,2000);

  return <>{splash ?<SplashScreen /> :<Text/>}</>;
  
  
};

export default App;
