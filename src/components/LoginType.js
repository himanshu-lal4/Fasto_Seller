import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
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
    <View style={styles.cardContainer}>
      <Card
        style={[styles.Card1, {backgroundColor: COLORS.secondaryButtonColor}]}>
        <TouchableOpacity
          style={stylesPage.cardBox}
          onPress={() => {
            facebookSignInHandle();
          }}>
          <MaterialCommunityIcons
            name="facebook"
            size={50}
            color="#3b5998"
            style={{}}
            type="MaterialCommunityIcons"
          />
        </TouchableOpacity>
      </Card>
      <Card
        style={[styles.Card1, {backgroundColor: COLORS.secondaryButtonColor}]}>
        <TouchableOpacity
          style={stylesPage.cardBox}
          onPress={() => {
            googleSignInHandle();
          }}>
          <Image
            style={{height: 50, width: 60}}
            source={require('../assets/icons/Google.webp')}
          />
        </TouchableOpacity>
      </Card>

      {isAppleLoginEnabled ? (
        <>
          <Card
            style={[
              styles.Card1,
              {backgroundColor: COLORS.secondaryButtonColor},
            ]}>
            <TouchableOpacity
              style={stylesPage.cardBox}
              onPress={() => console.log('Apple icon')}>
              <MaterialCommunityIcons
                name="apple"
                size={50}
                color="gray"
                type="MaterialCommunityIcons"
              />
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
