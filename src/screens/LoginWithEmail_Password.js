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
import React, {useEffect, useState} from 'react';
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
import auth from '@react-native-firebase/auth';
import Line from '../components/Common/Line';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is Required'),
  password: Yup.string()
    .required('Password is Required')
    .min(6, 'Password must be at least 6 characters'),
});

const createUserWithEmailPassword = (email, password) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account created & signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
    });
};

const signInUser = (email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log('User loggesd in Successfully' + userCredential);
    })
    .catch(error => {
      console.log('error while login ' + error);
    });
};

const LoginWithEmail_Password = () => {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);

  const handleSubmit = (values, actions) => {
    if (values) {
      createUserWithEmailPassword(values.email, values.password);
      // signInUser(values.email, values.password);
      // navigation.navigate('OnBoardScreen');
      actions.resetForm();
    }
  };

  //google Sign In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '750688566312-2s51gk33qf9ju5e3mfied01npk0ho5eg.apps.googleusercontent.com',
    });
  }, []);
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.container}>
        <ScrollView>
          <AuthHeader
            tittle="Sign In with Password"
            onPress={() => {
              navigation.goBack();
            }}
          />
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
                    onPress={handleSubmit}
                  />
                </View>
              )}
            </Formik>
          </View>
          <Line
            customStyle={styles.line}
            text="or continue with"
            line1Width={'34%'}
            line2Width={'34%'}
          />
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
                color={'#0074f4'}
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
    backgroundColor: '#202020',
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 30,
  },
  line: {marginTop: '20%', marginBottom: '2%'},
  label: {
    color: COLORS.white,
    marginTop: 6,
  },
  reset: {color: '#008fb3', marginLeft: '30%', marginTop: 7},
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
