import { StatusBar } from 'react-native'
import React from 'react'
import Login from '../screens/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../assets/theme';

const Stack = createStackNavigator();

const Authnavigation = () => {
  return (
    <>
      <StatusBar backgroundColor={COLORS.primaryBackgroundColor} />
      <Stack.Navigator
        initialRouteName='Login'
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name='Login' component={Login} />
       
      </Stack.Navigator>
    </>
  )
}

export default Authnavigation;