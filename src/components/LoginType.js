import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import styles from '../assets/theme/style';
import {Card} from 'react-native-paper';
import MaterialCommunityIcons from '../utils/VectorIcon';
import {COLORS, FONTS} from '../assets/theme';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';

const LoginType = () => {
  const navigation = useNavigation();

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
      <Card style={[styles.Card1, {backgroundColor: '#474f4f'}]}>
        <TouchableOpacity
          style={stylesPage.cardBox}
          onPress={() => console.log('Google icon')}>
          <MaterialCommunityIcons
            name="apple"
            size={50}
            color="white"
            type="MaterialCommunityIcons"
          />
          <Text style={[FONTS.body2, {color: COLORS.white1, paddingLeft: 20}]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>
      </Card>
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
