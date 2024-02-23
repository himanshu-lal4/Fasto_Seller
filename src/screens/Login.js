import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AuthHeader from '../components/Common/AuthHeader';
import LoginType from '../components/LoginType';
import {COLORS, FONTS, SIZES, theme} from '../assets/theme';
import Button from '../components/Common/Button';
import Line from '../components/Common/Line';

const Login = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.container}>
        <ScrollView>
          <AuthHeader tittle="Let's your in" />
          <LoginType />
          <Line text="Or" />
          <Button
            color="#ee1c24"
            tittle="SIGN IN WITH PASSWORD"
            onPress={() => {
              navigation.navigate('LoginWithEmail_Password');
            }}
          />
          <View style={styles.bottomView}>
            <Text style={[FONTS.body4, {color: COLORS.white1}]}>
              Don't have an account?
            </Text>
            <Text
              style={[FONTS.body4, {color: '#008fb3', marginLeft: 5}]}
              onPress={() => {}}>
              Sign up
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(18,38,54)',
  },
  ortext: {
    marginLeft: 190,
    color: 'gray',
    marginTop: 30,
  },
  line1: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: -9,
    width: 150,
    marginLeft: SIZES.basemarginleft,
  },
  line2: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 8,
    width: 150,
    marginLeft: 240,
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
  },
  icon1: {
    height: 100,
    width: 100,
  },
});

export default Login;
