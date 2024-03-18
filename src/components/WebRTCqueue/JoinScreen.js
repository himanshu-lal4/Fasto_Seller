import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, Button, View, Image} from 'react-native';

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {db} from '../utilities/firebase';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {TouchableOpacity} from 'react-native-gesture-handler';
import muteMicrophoneImage from '../../assets/images/mute-microphone.png';
import microphoneImage from '../../assets/images/microphone.png';
const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function JoinScreen({setScreen, screens, roomId, navigation}) {
  async function onBackPress() {
    console.log('inside onBackPress___>');
    if (cachedLocalPC) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
      cachedLocalPC.close();
    }
    setLocalStream();
    setRemoteStream();
    setCachedLocalPC();
    try {
      console.log('inside endCall try line no 36');
      await database().ref(`/Sellers/${roomId}`).update({
        sellerCallStatus: false,
      });
      console.log('after endCall try');
      console.log('Data updated.', roomId);
    } catch (error) {
      console.error('Error updating data:', error);
    }
    navigation.navigate('QR_codeScreen');
  }

  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();

  const [isMuted, setIsMuted] = useState(false);

  const startLocalStream = async () => {
    console.log('inside startLocalStream___>');

    // isFront will determine if the initial camera should face user or environment
    const isFront = true;
    const devices = await mediaDevices.enumerateDevices();

    const facing = isFront ? 'front' : 'environment';
    const videoSourceId = devices.find(
      device => device.kind === 'videoinput' && device.facing === facing,
    );
    const facingMode = isFront ? 'user' : 'environment';
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
  };

  const joinCall = async id => {
    const unsubscribe = database()
      .ref(`/Sellers/${roomId}`)
      .on('value', snapshot => {
        const data = snapshot?.val();
        if (data?.userCallStatus === false) {
          onBackPress();
        }
        console.log('Data updated:', data);
      });
    console.log('inside JoinCall------------->');
    const roomRef = await firestore().collection('rooms').doc(id);
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists) return;

    const offer = roomSnapshot.data().offer;
    if (!offer) {
      console.error('Offer not found in room data.');
      return;
    }

    const localPC = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach(track => {
      localPC.addTrack(track, localStream);
    });
    localPC.onerror = error => {
      console.error('An error occurred in peer connection setup:', error);
    };

    localPC.onicecandidate = e => {
      if (!e.candidate) {
        console.log('Got final candidate!');
        return;
      }
      roomRef.collection('calleeCandidates').add(e.candidate.toJSON());
    };

    localPC.ontrack = event => {
      event.streams.forEach(stream => {
        setRemoteStream(stream);
      });
    };

    try {
      await localPC.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await localPC.createAnswer();
      await localPC.setLocalDescription(answer);

      const roomWithAnswer = {answer};
      await roomRef.update(roomWithAnswer);

      roomRef.collection('callerCandidates').onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
          if (change.type === 'added') {
            let data = change.doc.data();
            await localPC.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });

      setCachedLocalPC(localPC);
    } catch (error) {
      console.error('Error setting up peer connection:', error);
    }
  };

  const switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  // Mutes the local's outgoing audio
  const toggleMute = () => {
    if (!remoteStream) {
      return;
    }
    localStream.getAudioTracks().forEach(track => {
      // console.log(track.enabled ? 'muting' : 'unmuting', ' local track', track);
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  return (
    <>
      <Text style={styles.heading}>Join Screen</Text>
      {/* <Text style={styles.heading}>Room : {roomId}</Text> */}

      <View style={styles.callButtons}>
        <View styles={styles.buttonContainer}>
          <TouchableOpacity onPress={onBackPress}>
            <Image
              style={{width: 50, height: 50}}
              source={require('../../assets/images/delete-button.png')}
            />
          </TouchableOpacity>
          {/* <Button title="Click to stop call" onPress={onBackPress} /> */}
        </View>
        <View styles={styles.buttonContainer}>
          {!localStream && (
            <Button title="Click to start stream" onPress={startLocalStream} />
          )}
          {localStream && (
            <Button
              title="Click to join call"
              onPress={() => joinCall(roomId)}
              disabled={!!remoteStream}
            />
          )}
        </View>
      </View>

      {localStream && (
        <View style={styles.toggleButtons}>
          <TouchableOpacity onPress={switchCamera}>
            <Image
              style={{width: 50, height: 50}}
              source={require('../../assets/images/switch-camera.png')}
            />
          </TouchableOpacity>
          {/* <Button title="Switch camera" onPress={switchCamera} /> */}
          <TouchableOpacity onPress={toggleMute}>
            <Image
              style={{width: 50, height: 50}}
              source={isMuted ? muteMicrophoneImage : microphoneImage}
            />
          </TouchableOpacity>
          {/* <Button
            title={`${isMuted ? 'Unmute' : 'Mute'} stream`}
            onPress={toggleMute}
            disabled={!remoteStream}
          /> */}
        </View>
      )}

      <View style={{display: 'flex', flex: 1, padding: 10}}>
        <View style={styles.rtcview}>
          {localStream && (
            <RTCView
              style={styles.rtc}
              streamURL={localStream && localStream.toURL()}
            />
          )}
        </View>
        <View style={styles.rtcview}>
          {remoteStream && (
            <RTCView
              style={styles.rtc}
              streamURL={remoteStream && remoteStream.toURL()}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  heading: {
    alignSelf: 'center',
    fontSize: 30,
  },
  rtcview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    margin: 5,
  },
  rtc: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  toggleButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  callButtons: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    margin: 5,
  },
});
