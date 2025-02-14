import React, { useState } from 'react';

import SplashScreen from './src/screens/splashScreen';
import { Login } from './src/screens';
import { Text } from 'react-native';
import AppNavigation from './src/navigations/AppNavigation';

const App = () => {
  const[splash,setSplash]=useState(true);
return(
 <AppNavigation/>)
};

export default App;

{/*setTimeout(()=>
    setSplash(false)
,2000);

  return <>{splash ?<SplashScreen /> :}</>;*/}