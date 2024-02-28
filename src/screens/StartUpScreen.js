import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {COLORS, FONTS} from '../assets/theme';
import Swiper from 'react-native-swiper';
import Button from '../components/Common/Button';

const StartUpScreen = ({navigation}) => {
  return (
    <Swiper style={styles.wrapper} showsButtons={false} loop={false}>
      <View style={styles.slide}>
        <Image
          source={require('../assets/images/first.png')}
          style={styles.image}
        />
        <Text style={[FONTS.body1]}>Welcome to our app!</Text>
        <Text style={{textAlign: 'center'}}>
          Lorem ipsum dolor sit amet, consectetur adip. Cum sociis nato,
          consectet.
        </Text>
      </View>
      <View style={styles.slide}>
        <Image
          source={require('../assets/images/second.png')}
          style={styles.image}
        />
        <Text style={[FONTS.h2]}>Discover amazing features.</Text>
        <Text style={{textAlign: 'center'}}>
          Lorem ipsum dolor sit amet, consectetur adip. Cum sociis nato,
          consectet.
        </Text>
      </View>
      <View style={styles.slide}>
        <Image
          source={require('../assets/images/third.png')}
          style={styles.image}
        />
        <Text style={[FONTS.h2]}>Get started now!</Text>
        <Text style={{textAlign: 'center'}}>
          Lorem ipsum dolor sit amet, consectetur adip. Cum sociis nato,
          consectet.
        </Text>
        <Button
          tittle={'Ready ?'}
          onPress={() => navigation.navigate('Auth')}
        />
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  window: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    backgroundColor: 'white',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default StartUpScreen;
