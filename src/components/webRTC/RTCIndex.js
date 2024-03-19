import React, {useEffect, useRef} from 'react';

import {
  BackHandler,
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc';
import {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {Dimensions} from 'react-native';
import {COLORS} from '../../assets/theme';
import VectorIcon from '../../utils/VectorIcon';
const {width, height} = Dimensions.get('window');
import {useDispatch, useSelector} from 'react-redux';
import {addChannelId} from '../../redux/callingChannelSlice';
import {initializeCrashlytics} from '../../utils/Crashlytics';
import database from '@react-native-firebase/database';
const RTCIndex = ({navigation}) => {
  const [remoteStream, setRemoteStream] = useState(null);
  const currentChannelId = useSelector(state => state.callingChannel.value);
  console.log('🚀 ~ RTCIndex ~ currentChannelId:', currentChannelId);

  const [webcamStarted, setWebcamStarted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [channelId, setChannelId] = useState(null);

  const pc = useRef();
  const dispatch = useDispatch();
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const startWebcam = async () => {
    try {
      const localStream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      console.log('Local Stream:', localStream);

      setLocalStream(localStream);

      pc.current = new RTCPeerConnection(servers); // Ensure pc.current is properly initialized

      pc.current.onconnectionstatechange = event => {
        console.log('Connection state changed:', pc.current.connectionState);
        if (pc.current.connectionState === 'disconnected') {
          // Peer connection closed
          console.log('Peer connection disconnected.');
          navigation.navigate('QR_codeScreen');
        } else if (pc.current.connectionState === 'closed') {
          console.log('Peer connection closed.');
          navigation.navigate('QR_codeScreen');
        }
      };

      // Add event listener for errors
      pc.current.onerror = error => {
        console.error('An error occurred:', error);
      };

      pc.current.ontrack = event => {
        console.log('Received remote tracks:', event.track);
        event.streams.forEach(stream => {
          console.log('Received remote stream:', stream);
          setRemoteStream(stream);
        });
      };

      localStream.getTracks().forEach(track => {
        pc.current.addTrack(track, localStream);
      });

      setWebcamStarted(true);
    } catch (error) {
      console.error('Error starting webcam:', error);
    }
  };

  const startCall = async () => {
    const channelDoc = firestore().collection('channels').doc();
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    setChannelId(channelDoc.id);

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await offerCandidates.add(event.candidate.toJSON());
      }
    };

    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);

    await channelDoc.set({offer: offer});

    channelDoc.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.current.setRemoteDescription(answerDescription);
      }
    });

    answerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  const joinCall = async () => {
    const channelDoc = firestore().collection('channels').doc(channelId);
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await answerCandidates.add(event.candidate.toJSON());
      }
    };

    const channelDocument = await channelDoc.get();
    const channelData = channelDocument.data();

    const offerDescription = channelData.offer;

    await pc.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription),
    );

    // const unsubscribe = channelDoc.onSnapshot(snapshot => {
    //   const data = snapshot.data();
    //   if (data && data.user === false) {
    //     endCall();
    //     // unsubscribe();
    //   }
    // });

    // const unsubscribe = channelDoc.onSnapshot(
    //   snapshot => {
    //     if (snapshot.exists) {
    //       const data = snapshot.data();
    //       if (data && data.user === false) {
    //         endCall();
    //         // unsubscribe();
    //       }
    //     } else {
    //       console.log('Document does not exist');
    //     }
    //   },
    //   error => {
    //     console.error('Error fetching snapshot:', error);
    //   },
    // );
    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);

    await channelDoc.update({answer: answer});

    offerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };
  console.log(remoteStream?.toURL());
  console.log('🚀 ~ RTCIndex ~ remoteStream:', remoteStream);
  console.log(localStream?.toURL());
  console.log('🚀 ~ RTCIndex ~ localStream:', localStream);
  const endCall = async () => {
    // Close the peer connection and reset states
    if (pc.current) {
      pc.current.close();
    }

    try {
      console.log('inside endCall try');
      await database().ref(`/Sellers/${currentChannelId}`).update({
        callStatus: false,
      });
      console.log('after endCall try');
      console.log('Data updated.', currentChannelId);
    } catch (error) {
      console.error('Error updating data:', error);
    }

    setLocalStream(null);
    setRemoteStream(null);
    setChannelId(null);
    setWebcamStarted(false);
    dispatch(addChannelId(null));

    // if (channelId) {
    //   const channelDoc = firestore().collection('channels').doc(channelId);
    //   await channelDoc.update({
    //     seller: false,
    //   });
    // }
    // navigation.navigate('QR_codeScreen');
  };
  setTimeout(function () {
    joinCall();
  }, 100);
  useEffect(() => {
    const fun = async () => {
      console.log('currentChannelId', currentChannelId);
      setChannelId(currentChannelId);
      await startWebcam();
    };
    fun();
  }, []);
  useEffect(() => {
    const backAction = () => {
      dispatch(addChannelId(null));
      endCall();
      console.log('Back button pressed');

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
    <KeyboardAvoidingView style={styles.body} behavior="position">
      <SafeAreaView style={styles.container}>
        {localStream && (
          <View
            style={remoteStream ? styles.joined : styles.localStreamContainer}>
            <RTCView
              streamURL={localStream?.toURL()}
              style={styles.stream}
              objectFit="cover"
              mirror
            />
          </View>
        )}

        {remoteStream && (
          <View style={styles.remoteStreamContainer}>
            <RTCView
              streamURL={remoteStream?.toURL()}
              style={styles.RemoteStream}
              objectFit="cover"
              mirror
            />
          </View>
        )}
        <View style={styles.buttons}>
          {/* {!webcamStarted && (
            <Button title="Start webcam" onPress={startWebcam} />
          )} */}
          {/* {webcamStarted && <Button title="Start call" onPress={startCall} />} */}
          {webcamStarted && (
            <View
              style={{
                flexDirection: 'row',
                marginBottom: 10,
                alignSelf: 'center',
              }}>
              {/* <Button title="Join call" onPress={joinCall} />
              <TextInput
                value={channelId}
                placeholder="callId"
                minLength={45}
                style={{borderWidth: 1, padding: 5}}
                onChangeText={newText => setChannelId(newText)}
              /> */}
              <VectorIcon
                name={'closecircle'}
                type={'AntDesign'}
                size={50}
                color={'red'}
                onPress={endCall}
              />
            </View>
          )}
        </View>
        {/* <Button title="End Call" onPress={endCall} /> */}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: COLORS.secondaryButtonColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  container: {
    width: width,
    height: height,
    zIndex: 1,
  },
  joined: {
    flex: 1,
    margin: 10,
    width: width * 0.95,
    height: height,
    borderRadius: 18,
    overflow: 'hidden',
  },
  localStreamContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 15,
    width: width * 0.95,
    height: height,
    borderRadius: 18,
    overflow: 'hidden',
  },
  stream: {
    flex: 1,
  },
  remoteStreamContainer: {
    flex: 1,
    margin: 10,
    width: width * 0.95,
    height: height,
    borderRadius: 18,
    overflow: 'hidden',
  },
  RemoteStream: {
    flex: 1,
  },
  buttons: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
});

export default RTCIndex;
