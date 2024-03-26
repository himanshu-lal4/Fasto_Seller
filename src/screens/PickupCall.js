import {useNavigation} from '@react-navigation/native';
import React, {useDebugValue, useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  BackHandler,
} from 'react-native';
import VectorIcon from '../utils/VectorIcon';
import {COLORS, FONTS} from '../assets/theme';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {addChannelId} from '../redux/callingChannelSlice';
import database from '@react-native-firebase/database';
import InCallManager from 'react-native-incall-manager';
import ringtonePath from '../assets/audio/ringtone_call_phone.mp3';
const PickupCall = () => {
  InCallManager.start();

  const navigation = useNavigation();
  const [borderWidth] = useState(new Animated.Value(1));
  const [borderWidth2] = useState(new Animated.Value(1));
  const [userName, setUserName] = useState('');
  const [userImgURL, setUserImgURL] = useState(null);
  const dispatch = useDispatch();
  const incomingUser = useSelector(state => state.incomingUser.value);
  const channelId = useSelector(state => state.callingChannel.value);
  // const {remoteMessage} = route.params;
  console.log('🚀 ~ useSelector ~ channelid:', channelId);
  console.log('🚀 ~ PickupCall ~ incomingUser:', incomingUser);
  async function getIncomingUserData() {
    console.log('reached getIncomingUserData');

    try {
      const documentSnapshot = await firestore()
        .collection('Users')
        .doc(incomingUser)
        .get();

      console.log('User exists: ', documentSnapshot.exists);

      if (documentSnapshot.exists) {
        console.log('User data: ', documentSnapshot.data().photoUrl);
        console.log(
          'documentSnapshot.data().data.photoUrl',
          documentSnapshot.data(),
        );
        setUserImgURL(documentSnapshot.data().photoUrl);
        setUserName(documentSnapshot.data().name);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    const unsubscribe = database()
      .ref(`/Sellers/${channelId}`)
      .on('value', snapshot => {
        const data = snapshot?.val();
        if (data?.userCallStatus === false) {
          cutCall();
        }
        console.log('Data updated:', data);
      });
  }, []);

  useEffect(() => {
    console.log('reached useEffect');
    getIncomingUserData();
    animateBorder(borderWidth);
    animateBorder(borderWidth2);
  }, [incomingUser]);
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

  const cutCall = async () => {
    if (channelId) {
      console.log('inside cut call');
      try {
        await database().ref(`/Sellers/${channelId}`).update({
          sellerCallStatus: false,
        });
        console.log('Data updated.', channelId);
      } catch (error) {
        console.error('Error updating data:', error);
      }
      // navigation.navigate('QR_codeScreen');
    }
    dispatch(addChannelId(null));
    // route.params.remoteMessage = null;
    const sellerRef = database().ref(`/SellersOnCallStatus/${sellerId}`);
    sellerRef.once('value', async snapshot => {
      const sellerData = snapshot.val();
      if (sellerData && sellerData.isSellerOnCall === true) {
        console.log(
          'if if ifififififififififififififififififififififififififififif',
        );
        // Seller exists and is already on another call, send notification A
      } else {
        console.log(
          'else eelsejlk fjddlksfjalk;felseelseelseelseelseelseelseelseelseelseelseelsej',
        );
        // Seller doesn't exist or is available, send notification B
        navigation.navigate('QR_codeScreen');
      }
    });
  };

  useEffect(() => {
    const backAction = () => {
      dispatch(addChannelId(null));
      console.log('Back button pressed');
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Remove the event listener on component unmount

    // The empty dependency array ensures that this effect runs once
    // Similar to componentDidMount in class components
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        {/* <Image 
          source={require('../assets/images/userIcon.png')}
          style={styles.profileImage}
        />*/}
        <Image
          source={
            userImgURL
              ? {uri: userImgURL}
              : require('../assets/images/userIcon.png')
          }
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
        {userName}
      </Text>
      <View style={styles.buttonView}>
        <TouchableOpacity
          style={styles.pickButton}
          onPress={() => {
            InCallManager.stopRingtone();
            navigation.navigate('WebRTCIndex');
          }}>
          <VectorIcon
            name={'call'}
            type={'MaterialIcons'}
            size={30}
            color={COLORS.white}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.endButton} onPress={() => cutCall()}>
          <VectorIcon
            name={'call-end'}
            type={'MaterialIcons'}
            size={30}
            color={COLORS.white}
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
