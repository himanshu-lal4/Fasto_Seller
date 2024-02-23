import {StatusBar} from 'react-native';
import React from 'react';
import Login from '../screens/Login';
import OnBoardScreen from '../screens/OnBoardScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../assets/theme';
import SubcategoryScreen from '../components/onBoarding/subCategory';

const Stack = createStackNavigator();

const Authnavigation = () => {
  return (
    <>
      <StatusBar backgroundColor={COLORS.primaryBackgroundColor} />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OnBoardScreen" component={OnBoardScreen} />
        <Stack.Screen name="SubcategoryScreen" component={SubcategoryScreen} />
      </Stack.Navigator>
    </>
  );
};

export default Authnavigation;
