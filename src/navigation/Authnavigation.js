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
import Qr_codeScreen from '../screens/Qr_codeScreen';
import auth from '@react-native-firebase/auth';
import {useEffect} from 'react';
import {useState} from 'react';
import StartUpScreen from '../screens/StartUpScreen';
import {useDispatch} from 'react-redux';
import {addUID} from '../redux/userTokenSlice';
import RTCIndex from '../components/webRTC/RTCIndex';
import {useNavigation} from '@react-navigation/native';
import {registerNotifee} from '../components/SendNotification';
import PickCallScreen from '../screens/PickCallScreen';
const Stack = createStackNavigator();

const Authnavigation = () => {
  const [user, setUser] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const unregister = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        setUser(userExist);
        dispatch(addUID(userExist.uid));
      } else {
        setUser('');
      }
    });
    return () => {
      unregister();
    };
  }, []);

  const navigation = useNavigation();
  //setup notification
  useEffect(() => {
    registerNotifee(navigation);
  }, []);

  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={COLORS.darkBlue} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {user ? (
          <>
            <Stack.Screen name="PickCallScreen" component={PickCallScreen} />
            <Stack.Screen name="OnBoardScreen" component={OnBoardScreen} />
            <Stack.Screen
              name="SubcategoryScreen"
              component={SubcategoryScreen}
            />
            <Stack.Screen name="ChooseImgScreen" component={ChooseImgScreen} />
            <Stack.Screen name="QR_codeScreen" component={Qr_codeScreen} />
            <Stack.Screen name="RTCIndex" component={RTCIndex} />
          </>
        ) : (
          <>
            <Stack.Screen name="StartUpScreen" component={StartUpScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen
              name="LoginWithEmail_Password"
              component={LoginWithEmail_Password}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default Authnavigation;
