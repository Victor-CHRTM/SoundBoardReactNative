import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeScreen from '../screens/HomeScreen';
import RecordScreen from '../screens/RecordScreen';
import DefaultSoundTab from '../screens/DefaultSoundTab';
import RecordedSoundTab from '../screens/RecordedSoundTab';
import PhoneSoundTab from '../screens/PhoneSoundTab';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function RaveTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="DefaultSoundTab" component={DefaultSoundTab} />
      <Tab.Screen name="RecordedSoundTab" component={RecordedSoundTab} />
      <Tab.Screen name="PhoneSoundTab" component={PhoneSoundTab} />
    </Tab.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Record" component={RecordScreen} />
      <Tab.Screen name="Rave" component={RaveTabs} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}