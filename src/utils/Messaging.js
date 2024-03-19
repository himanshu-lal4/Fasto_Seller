import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {addChannelId} from '../redux/callingChannelSlice';
import {addIncomingUser} from '../redux/IncomingUserSlice';
const handleNotificationClick = async (remoteMessage, navigation, dispatch) => {
  //   const navigation = useNavigation();
  console.log(
    'Notification clicked while app is in the background:',
    remoteMessage,
  );
  if (remoteMessage) {
    dispatch(addChannelId(remoteMessage.data.channelId));
    dispatch(addIncomingUser(remoteMessage.data.userUID));

    console.log(
      'user Id & channelId in message ',
      remoteMessage.data.channelId,
      ' ',
      remoteMessage.data.userUID,
    );
    navigation.navigate('PickupCall');
  }

  // const sound = '../assets/notificationSound/callingSound.mp3';
  // const sound = 'file://../callingSound.mp3';
  // const notificationSound = new Sound(sound);
  // notificationSound.play();

  console.log(remoteMessage);
};

export const registerNotificationHandlers = (navigation, dispatch) => {
  // Function to handle initial notification when the app is opened from terminated state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      // Handle initial notification when the app is opened from terminated state
      if (remoteMessage) {
        handleNotificationClick(remoteMessage, navigation, dispatch);
      }
    });

  messaging().onMessage(async remoteMessage => {
    // Handle notification click here
    dispatch(addChannelId(remoteMessage.data.channelId));
    dispatch(addIncomingUser(remoteMessage.data.userUID));
    console.log(
      'Notification clicked while app is in the foreground:',
      remoteMessage,
    );
    navigation.navigate('PickupCall');
  });
  // Function to handle notification clicks when the app is opened from background or terminated
  messaging().onNotificationOpenedApp(async remoteMessage => {
    // This will be triggered if the app was already open when the notification was clicked
    handleNotificationClick(remoteMessage, navigation, dispatch);
  });
};
