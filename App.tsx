
import 'react-native-reanimated';
import React, { useState } from 'react';
import SplashScreen from './src/screens/splashScreen';
import AppNavigation from './src/navigations/AppNavigation';

function App(): React.JSX.Element {
 
  const [splash,setSplash]= useState(true);

  setTimeout(()=>
    setSplash(false)
,2000);


  return (
    
      <>{splash ?<SplashScreen /> : <AppNavigation/>}</>
  );
}


export default App;
