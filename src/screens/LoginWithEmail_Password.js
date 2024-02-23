import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import InputText from '../components/Common/InputText';
import Button from '../components/Common/Button';
import Icons from 'react-native-vector-icons/Ionicons';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {COLORS, FONTS} from '../assets/theme';
import AuthHeader from '../components/Common/AuthHeader';
import {Checkbox} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is Required'),
  password: Yup.string()
    .required('Password is Required')
    .min(6, 'Password must be at least 6 characters'),
});

const LoginWithEmail_Password = () => {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);
  const handleSubmit = values => {
    if (checked) {
      console.log(values);
    }
  };

  //google Sign In
  const googleSignInHandle = async () => {
    try {
      await GoogleSignin.configure();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
      if (userInfo.length !== 0) {
        navigation.navigate('OnBoardScreen');
        console.log('Atishay');
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.container}>
        <ScrollView>
          <AuthHeader tittle="Sign In with Password" />
          <View style={{marginTop: 30}}>
            <Formik
              initialValues={{email: '', password: ''}}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {({handleChange, handleSubmit, values, errors, touched}) => (
                <View>
                  <View style={{height: 90}}>
                    <InputText
                      value={values.email}
                      placeholder="Email"
                      onChangeText={handleChange('email')}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>
                  <View style={{height: 90}}>
                    <InputText
                      value={values.password}
                      placeholder="Password"
                      onChangeText={handleChange('password')}
                      secure={true}
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      status={checked ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setChecked(!checked);
                      }}
                    />
                    <Text style={styles.label}>Remember me</Text>
                    <TouchableOpacity>
                      <Text style={styles.reset}>Reset Password</Text>
                    </TouchableOpacity>
                  </View>
                  <Button
                    color="#ee1c24"
                    tittle="SIGN IN"
                    onPress={() => {
                      navigation.navigate('OnBoardScreen');
                    }}
                  />
                </View>
              )}
            </Formik>
          </View>
          <View style={styles.continue}>
            <View style={styles.line}></View>
            <Text style={{color: COLORS.gray}}>or continue with</Text>
            <View style={styles.line}></View>
          </View>
          <View style={styles.icons}>
            <TouchableOpacity
              TouchableOpacity={0.7}
              onPress={googleSignInHandle}>
              <View style={styles.google}>
                <Image
                  style={styles.googleIcon}
                  source={require('../assets/icons/Google.webp')}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              TouchableOpacity={0.7}
              onPress={facebookSignInHandle}>
              <Icons
                style={styles.icon}
                name="logo-facebook"
                size={32}
                color={'blue'}
              />
            </TouchableOpacity>
            <Icons
              style={styles.icon}
              name="logo-apple"
              size={32}
              color={COLORS.white1}
            />
          </View>

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
export default LoginWithEmail_Password;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(18,38,54)',
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 30,
  },
  label: {
    color: COLORS.white,
    marginTop: 6,
  },
  reset: {color: '#008fb3', marginLeft: '30%', marginTop: 7},
  continue: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 35,
    marginTop: 60,
  },
  line: {
    width: 100,
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
    marginBottom: 8,
    marginHorizontal: 10,
  },
  google: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: COLORS.graybackground,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 60,
    marginBottom: 10,
    justifyContent: 'center',
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 30,
    marginTop: 50,
    marginHorizontal: '15%',
  },
  googleIcon: {
    height: 40,
    width: 40,
  },
  icon: {
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: COLORS.graybackground,
  },
  errorText: {
    color: COLORS.red,
    marginLeft: '5%',
  },
  below: {
    color: COLORS.white,
  },
});
