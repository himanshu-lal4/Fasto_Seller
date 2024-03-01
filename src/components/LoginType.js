import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../assets/theme/style';
import {Card} from 'react-native-paper';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import {COLORS, FONTS} from '../assets/theme';
import auth from '@react-native-firebase/auth';
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
        '750688566312-2s51gk33qf9ju5e3mfied01npk0ho5eg.apps.googleusercontent.com',
    });
  }, []);

  //google Sign In
  const googleSignInHandle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      if (idToken) {
        navigation.navigate('OnBoardScreen');
      }
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('user canceil the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('google sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play services not avaliable or outdated');
      } else {
        console.log(error);
      }
    }
  };

  //Facebook Sign In
  const facebookSignInHandle = async () => {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      console.log('User cancelled the login process');
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    return auth().signInWithCredential(facebookCredential);
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
          <VectorIcon
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
            style={{height: 50, width: 53}}
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
              <VectorIcon
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
