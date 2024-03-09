import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import VectorIcon from '../utils/VectorIcon';
import {COLORS, FONTS} from '../assets/theme';

const PickupCall = () => {
  const navigation = useNavigation();
  const [borderWidth] = useState(new Animated.Value(1));
  const [borderWidth2] = useState(new Animated.Value(1));

  useEffect(() => {
    animateBorder(borderWidth);
    animateBorder(borderWidth2);
  }, []);

  const animateBorder = borderWidth => {
    Animated.sequence([
      Animated.timing(borderWidth, {
        toValue: 3,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(borderWidth, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start(() => {
      animateBorder(borderWidth);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Image
          source={require('../assets/images/userIcon.png')}
          style={styles.profileImage}
        />
        <Animated.View
          style={[
            styles.animatedCircle,
            {
              borderWidth: borderWidth,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.animatedCircle2,
            {
              borderWidth: borderWidth2,
            },
          ]}
        />
      </View>
      <Text
        style={[
          FONTS.h2,
          {color: COLORS.darkBlue, fontWeight: '600', marginTop: 25},
        ]}>
        Your Name
      </Text>
      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.pickButton}>
          <VectorIcon
            name={'call'}
            type={'MaterialIcons'}
            size={30}
            color={COLORS.white}
            onPress={() => navigation.navigate('RTCIndex')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.endButton}>
          <VectorIcon
            name={'call-end'}
            type={'MaterialIcons'}
            size={30}
            color={COLORS.white}
            onPress={() => navigation.navigate('RTCIndex')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 10,
  },
  animatedCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 100,
    borderColor: 'gray',
  },
  animatedCircle2: {
    position: 'absolute',
    top: -15,
    width: 180,
    height: 180,
    borderRadius: 110,
    borderColor: 'gray',
  },
  buttonView: {
    flexDirection: 'row',
    marginTop: 50,
  },
  pickButton: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  endButton: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default PickupCall;
