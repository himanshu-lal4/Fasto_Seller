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
import Line from '../components/Common/Line';

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
  const handleSubmit = (values, actions) => {
    if (values) {
      console.log(values);
      navigation.navigate('OnBoardScreen');
      actions.resetForm();
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
                  <View>
                    <InputText
                      value={values.email}
                      placeholder="Email"
                      onChangeText={handleChange('email')}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>
                  <View>
                    <InputText
                      value={values.password}
                      placeholder="Password"
                      onChangeText={handleChange('password')}
                      style={{height: 50}}
                      secure={true}
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  <View style={styles.checkboxContainer}>
                    <View
                      style={{flexDirection: 'row', justifyContent: 'center'}}>
                      <Checkbox
                        color="#0a57fd"
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setChecked(!checked);
                        }}
                      />
                      <Text style={styles.label}>Remember me</Text>
                    </View>

                    <TouchableOpacity>
                      <Text style={styles.reset}>Reset Password</Text>
                    </TouchableOpacity>
                  </View>

                  <Button tittle="sign in" onPress={() => handleSubmit} />
                </View>
              )}
            </Formik>
          </View>
          <View style={styles.bottomView}>
            <Text style={[FONTS.body4, {color: COLORS.black}]}>
              Don't have an account?
            </Text>
            <Text
              style={[FONTS.body4, {color: COLORS.blue, marginLeft: 5}]}
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
    backgroundColor: 'white',
  },
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 30,
  },
  line: {marginTop: '20%', marginBottom: '2%'},
  label: {
    color: COLORS.black,
    marginTop: 6,
  },
  reset: {color: COLORS.blue, marginLeft: '30%', marginTop: 7},
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
