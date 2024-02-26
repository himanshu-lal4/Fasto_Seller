import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../assets/theme/style';
import {Card} from 'react-native-paper';
import MaterialCommunityIcons from '../utils/VectorIcon';
import {COLORS, FONTS} from '../assets/theme';
import {useNavigation} from '@react-navigation/native';
import featureFlag from './remoteConfig';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';

const LoginType = () => {
  const navigation = useNavigation();
  const isAppleLoginEnabled = featureFlag();
  

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '843686181066-b0crro208ejatlau4vc52ohapmg4v12f.apps.googleusercontent.com',
      client_type: 3,
      offlineAccess: true,
    });
  }, []);

  //google Sign In
  const googleSignInHandle = async () => {
    try {
      await GoogleSignin.configure();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      if (userInfo.length !== 0) {
        navigation.navigate('OnBoardScreen');
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
        console.log(error);
      }
    }
  };

  //Facebook Sign In
  const facebookSignInHandle = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
      ]);
      if (result.isCancelled) {
        console.log('Login cancelled');
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        if (data) {
          console.log(data.accessToken.toString());
          navigation.navigate('OnBoardScreen');
          console.log(data);
          // Call onLoginFinished callback or perform further actions here
        }
      }
    } catch (error) {
      console.log('Login failed with error: ', error);
    }
  };

  return (
    <View style={styles.authContainertext}>
      <Card style={[styles.Card1, {backgroundColor: '#413945'}]}>
        <TouchableOpacity
          style={stylesPage.cardBox}
          onPress={() => {
            facebookSignInHandle();
          }}>
          <MaterialCommunityIcons
            name="facebook"
            size={50}
            color="#0074f4"
            style={{}}
            type="MaterialCommunityIcons"
          />
          <Text style={[FONTS.body2, {color: COLORS.white1, paddingLeft: 20}]}>
            Continue with Facebook
          </Text>
        </TouchableOpacity>
      </Card>
      <Card style={[styles.Card1, {backgroundColor: '#474f44'}]}>
        <TouchableOpacity
          style={stylesPage.cardBox}
          onPress={() => {
            googleSignInHandle();
          }}>
          <MaterialCommunityIcons
            name="google"
            size={50}
            color="white"
            type="MaterialCommunityIcons"
          />
          <Text style={[FONTS.body2, {color: COLORS.white1, paddingLeft: 20}]}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </Card>

      {isAppleLoginEnabled ? (
        <>
          <Card style={[styles.Card1, {backgroundColor: '#474f4f'}]}>
            <TouchableOpacity
              style={stylesPage.cardBox}
              onPress={() => console.log('Apple icon')}>
              <MaterialCommunityIcons
                name="apple"
                size={50}
                color="white"
                type="MaterialCommunityIcons"
              />
              <Text
                style={[FONTS.body2, {color: COLORS.white1, paddingLeft: 20}]}>
                Continue with Apple
              </Text>
            </TouchableOpacity>
          </Card>
        </>
      ) : null}
    </View>
  );
};

export default LoginType;

const stylesPage = StyleSheet.create({
  cardBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
