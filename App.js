//import React, {useEffect, useState} from 'react';
import User from './src/screens/User';
import Preferences from './src/screens/Preferences';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const App = () => {
  const Stack = createNativeStackNavigator();
  return (
    /*<Preferences />*/
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="User Info" component={User} />
        <Stack.Screen name="Preferences" component={Preferences} />
      </Stack.Navigator>
    </NavigationContainer>
  )    
};

export default App;
