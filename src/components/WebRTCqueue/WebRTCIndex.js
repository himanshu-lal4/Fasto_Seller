import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  RecyclerViewBackedScrollView,
} from 'react-native';
import RoomScreen from './RoomScreen';
import CallScreen from './CallScreen';
import JoinScreen from './JoinScreen';
import {useSelector} from 'react-redux';
export default function WebRTCIndex({navigation}) {
  const currentChannelId = useSelector(state => state.callingChannel.value);
  const screens = {
    ROOM: 'JOIN_ROOM',
    CALL: 'CALL',
    JOIN: 'JOIN',
  };

  const [screen, setScreen] = useState(screens.JOIN);
  const [roomId, setRoomId] = useState('');

  let content;

  switch (screen) {
    case screens.ROOM:
      content = (
        <RoomScreen
          roomId={currentChannelId}
          setRoomId={setRoomId}
          screens={screens}
          setScreen={setScreen}
        />
      );
      break;

    case screens.CALL:
      content = (
        <CallScreen
          roomId={currentChannelId}
          screens={screens}
          setScreen={setScreen}
          navigation={navigation}
        />
      );
      break;

    case screens.JOIN:
      content = (
        <JoinScreen
          roomId={currentChannelId}
          screens={screens}
          setScreen={setScreen}
          navigation={navigation}
        />
      );
      break;

    default:
      content = <Text>Wrong Screen</Text>;
  }

  return <SafeAreaView style={styles.container}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
