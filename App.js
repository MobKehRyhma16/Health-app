import React, { useEffect } from 'react';
import MyTabs from './Components/BottomTab';
import { NavigationContainer } from '@react-navigation/native';


function App() {

  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );

}

export default App;
