import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import styles from '../assets/theme/style';
import {Card} from 'react-native-paper';
import MaterialCommunityIcons from '../utils/VectorIcon';
import {COLORS, FONTS} from '../assets/theme';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const LoginType = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '843686181066-b0crro208ejatlau4vc52ohapmg4v12f.apps.googleusercontent.com',
    });
  }, []);

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setState({userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <View style={styles.authContainertext}>
      <Card style={[styles.Card1, {backgroundColor: COLORS.graybackground}]}>
        <TouchableOpacity
          style={stylesPage.cardBox}
          onPress={() => console.log('Facebook icon')}>
          <MaterialCommunityIcons
            name="facebook"
            size={45}
            color="rgb(23, 169, 253)"
            style={{}}
            type="MaterialCommunityIcons"
          />
          <Text style={[FONTS.body3, {color: COLORS.white1, paddingLeft: 20}]}>
            Continue with Facebook
          </Text>
        </TouchableOpacity>
      </Card>
      <Card style={[styles.Card1, {backgroundColor: COLORS.graybackground}]}>
        <TouchableOpacity style={stylesPage.cardBox} onPress={() => signIn()}>
          <MaterialCommunityIcons
            name="google"
            size={45}
            color="white"
            type="MaterialCommunityIcons"
          />
          <Text style={[FONTS.body3, {color: COLORS.white1, paddingLeft: 20}]}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </Card>
      <Card style={[styles.Card1, {backgroundColor: COLORS.graybackground}]}>
        <TouchableOpacity
          style={stylesPage.cardBox}
          onPress={() => console.log('Google icon')}>
          <MaterialCommunityIcons
            name="apple"
            size={45}
            color="white"
            type="MaterialCommunityIcons"
          />
          <Text style={[FONTS.body3, {color: COLORS.white1, paddingLeft: 20}]}>
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
