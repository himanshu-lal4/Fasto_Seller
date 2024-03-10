import {Platform} from 'react-native';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {addChannelId} from '../redux/callingChannelSlice';
var nav = null;
export const registerNotifee = async (navigation, dispatch) => {
  nav = navigation;
  // Register the device with FCM
  await messaging().registerDeviceForRemoteMessages();

  // Get the token
  const token = await messaging().getToken();

  console.log('Notification token ---> ' + token);

  async function onMessageReceived(message) {
    // notifee.displayNotification(message.data.notifee);
    console.log(message.notification.title);
    console.log(message.notification.body);
    // const {channelId} = message.data;
    dispatch(addChannelId(message.data.channelId));
    console.log('remote data ', message.data.channelId);
    console.log('user UID ', message.data.userUID);
    await sendNotification(
      message.notification.title,
      message.notification.body,
    );
  }

  messaging().onMessage(onMessageReceived);
  messaging().setBackgroundMessageHandler(onMessageReceived);

  return notifee.onForegroundEvent(({type, detail}) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', detail.notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', detail.notification);
        // navigation.navigate('OnBoardScreen');
        navigation.navigate('PickupCall');
        break;
    }
  });
};
notifee.onBackgroundEvent(async ({type, detail}) => {
  switch (type) {
    case EventType.DISMISSED:
      console.log('User dismissed notification', detail.notification);
      break;
    case EventType.PRESS:
      console.log('User pressed notification', detail.notification);
      nav?.navigate('PickupCall');

      break;
  }
});

export const sendNotification = async (title, body) => {
  // Request permissions (required for iOS)
  if (Platform.OS === 'ios') {
    await notifee.requestPermission();
  }

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default1',
    name: 'Default Channel',
    sound: 'default',
    // sound: {uri: '../assets/notificationSound/callingSound.mp3'},
    importance: AndroidImportance.HIGH,
  });

  // Display a notification
  await notifee.displayNotification({
    title: title,
    body: body,
    android: {
      channelId,
      smallIcon: 'ic_launcher',
      // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'default1',
      },
    },
  });
};
