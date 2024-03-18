import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, Button, View, Image} from 'react-native';

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {TouchableOpacity} from 'react-native-gesture-handler';
import muteMicrophoneImage from '../../assets/images/voice.png';
import microphoneImage from '../../assets/images/microphone.png';
import InCallManager from 'react-native-incall-manager';
const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function JoinScreen({setScreen, screens, roomId, navigation}) {
  const [startWebCamState, setStartWebCamState] = useState();
  async function onBackPress() {
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
      await database().ref(`/Sellers/${roomId}`).update({
        sellerCallStatus: false,
      });
      console.log('Data updated.', roomId);
    } catch (error) {
      console.error('Error updating data:', error);
    }
    navigation.navigate('QR_codeScreen');
  }

  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const startLocalStream = async () => {
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
          minWidth: 500,
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
    setStartWebCamState(true);
  };

  const joinCall = async id => {
    console.log('join Call rendered');
    const unsubscribe = database()
      .ref(`/Sellers/${roomId}`)
      .on('value', snapshot => {
        const data = snapshot?.val();
        if (data?.userCallStatus === false) {
          onBackPress();
        }
        console.log('Data updated:', data);
      });

    const roomRef = await firestore().collection('rooms').doc(id);
    const roomSnapshot = await roomRef.get();

    if (!roomSnapshot.exists) return;
    console.log('reached till last');
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
  const toggleSpeaker = () => {
    console.log('toggleSpeaker');
  };

  const toggleMute = () => {
    if (!remoteStream) {
      return;
    }
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  useEffect(() => {
    // Call function 1
    startLocalStream();
  }, []); // Empty dependency array ensures this runs only once after mount

  useEffect(() => {
    // Check if state1 is updated, then call function 2
    console.log(
      'inside useEffect startWebCamState value============>',
      startWebCamState,
    );
    if (startWebCamState === true) {
      console.log(
        'inside useEffect if condition startWebCamState value============>',
        startWebCamState,
      );
      joinCall(roomId);
    }
  }, [startWebCamState]);
  console.log(
    'outside useEffect startWebCamState value============>',
    startWebCamState,
  );

  return (
    <>
      {/* <Text style={styles.heading}>Join Screen</Text> */}
      {/* <Text style={styles.heading}>Room : {roomId}</Text> */}

      {/* <View style={styles.callButtons}> */}

      <View style={{display: 'flex', flex: 1}}>
        <View style={styles.rtcview}>
          {localStream && (
            <RTCView
              style={styles.rtc}
              streamURL={localStream && localStream.toURL()}
            />
          )}
        </View>
        {remoteStream && (
          <View style={styles.rtcview}>
            <RTCView
              style={styles.rtc}
              streamURL={remoteStream && remoteStream.toURL()}
            />
          </View>
        )}
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.toggleButtons}>
          <TouchableOpacity>
            <Image
              style={{width: 40, height: 40, marginTop: 4}}
              source={require('../../assets/images/chat.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleSpeaker}>
            <Image
              style={{width: 50, height: 50}}
              source={require('../../assets/images/speaker.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={switchCamera}>
            <Image
              style={{width: 40, height: 40, marginTop: 4}}
              source={require('../../assets/images/switch-camera.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMute}>
            <Image
              style={{width: 40, height: 40, marginTop: 4}}
              source={isMuted ? muteMicrophoneImage : microphoneImage}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onBackPress}>
            <Image
              style={{width: 40, height: 40, marginTop: 4}}
              source={require('../../assets/images/phone-call-end.png')}
            />
          </TouchableOpacity>
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
    width: '100%',
    height: '100%',
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
    objectFit: 'cover',
    marginBottom: 20,
  },
  rtc: {
    width: '100%',
    height: '100%',
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    objectFit: 'cover',
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
  },
  buttonContainer: {
    margin: 5,
  },
});
