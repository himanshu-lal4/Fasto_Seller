import {StatusBar} from 'react-native';
import React from 'react';
import Login from '../screens/Login';
import OnBoardScreen from '../screens/OnBoardScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../assets/theme';
import SubcategoryScreen from '../components/onBoarding/subCategory';
import LoginWithEmail_Password from '../screens/LoginWithEmail_Password';
import ChooseImgScreen from '../screens/ChooseImgScreen';
import SelectImage from '../components/SelectImg';

const Stack = createStackNavigator();

const Authnavigation = () => {
  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={COLORS.darkBlue} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OnBoardScreen" component={OnBoardScreen} />
        <Stack.Screen name="SubcategoryScreen" component={SubcategoryScreen} />
        <Stack.Screen
          name="LoginWithEmail_Password"
          component={LoginWithEmail_Password}
        />
        <Stack.Screen name="ChooseImgScreen" component={ChooseImgScreen} />
        <Stack.Screen name="SelectImage" component={SelectImage} />
      </Stack.Navigator>
    </>
  );
};

export default Authnavigation;
