import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  Button,
  View,
  Image,
  BackHandler,
  FlatList,
} from 'react-native';

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
import speakerOnImg from '../../assets/images/speaker.png';
import speakerOfImg from '../../assets/images/speaker-filled-audio-tool.png';
import InCallManager from 'react-native-incall-manager';
import {useSelector} from 'react-redux';
import {DummyData} from './DummyData';
import {COLORS, FONTS} from '../../assets/theme';
const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function JoinScreen({setScreen, screens, roomId, navigation}) {
  // console.log('roomId----->', roomId);
  const sellerId = useSelector(state => state.userToken.UID);
  // console.log('🚀 ~ JoinScreen ~ sellerId:', sellerId);
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [startWebCamState, setStartWebCamState] = useState();
  const [allCallUser, setAllCallUsers] = useState([]);
  let allRooms = [];
  // let allRooms2 = ['4NugCWS7m8cnOwwuK4GS', '56cl0M4h7A3rXFWmTIrm'];
  async function fetchAllRooms() {
    await firestore()
      .collection('videoRoom')
      .doc(sellerId)
      .collection('rooms')
      .onSnapshot(
        async querySnapshot => {
          allRooms = [];

          querySnapshot.forEach(doc => {
            allRooms.push(doc.id);
          });

          // console.log('AllRooms IDs:', allRooms);
          await fetchUserDetailsFromRooms();
          console.log('user details fetched --------------- >>>>>>>>>>>>>>>.');
        },
        error => {
          console.error('Error fetching channel IDs:', error);
        },
      );
  }

  const fetchUserDetailsFromRooms = async () => {
    const allUserDetails = [];
    for (let i = 0; i < allRooms.length; i++) {
      const roomId = allRooms[i];

      // Get a reference to the currCallData document for each room
      const currCallDataRef = await firestore()
        .collection('videoRoom')
        .doc(sellerId)
        .collection('rooms')
        .doc(roomId)
        .collection('currCallData')
        .doc(sellerId);

      // Get the userData from currCallData for each room
      const currCallDataSnapshot = await currCallDataRef.get();
      if (currCallDataSnapshot.exists) {
        const userData = currCallDataSnapshot.data();
        const {name, email, photoUrl, deviceToken} = userData.userData;
        allUserDetails.push({name, email, photoUrl, deviceToken, roomId});
      } else {
        console.log('Document not found');
      }
    }
    setAllCallUsers(allUserDetails);
    console.log(
      'all userDetails after fetching data from rooms',
      allUserDetails,
    );
  };

  async function onBackPress() {
    console.log('ALL user data ------------------------> ', allCallUser);
    if (cachedLocalPC) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
      cachedLocalPC.close();
    }
    // setLocalStream();
    setRemoteStream();
    setCachedLocalPC();
    try {
      await database().ref(`/Sellers/${roomId}`).update({
        sellerCallStatus: false,
      });
      // console.log('Data updated.', roomId);
    } catch (error) {
      console.error('Error updating data:', error);
    }

    if (remoteStream) {
      firestore()
        .collection('videoRoom')
        .doc(sellerId)
        .collection('rooms')
        .doc(roomId)
        .collection('callerCandidates') // First collection within 'channelId' document
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        })
        .then(() => {
          // Step 2: Delete all documents within the second collection
          return firestore()
            .collection('videoRoom')
            .doc(sellerId)
            .collection('rooms')
            .doc(roomId)
            .collection('currCallData') // Second collection within 'channelId' document
            .get();
        })
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        })
        .then(() => {
          // Step 2: Delete all documents within the second collection
          return firestore()
            .collection('videoRoom')
            .doc(sellerId)
            .collection('rooms')
            .doc(roomId)
            .collection('calleeCandidates') // Second collection within 'channelId' document
            .get();
        })
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        })
        .then(() => {
          // Step 3: Delete the 'channelId' document
          return firestore()
            .collection('videoRoom')
            .doc(sellerId)
            .collection('rooms')
            .doc(roomId)
            .delete();
        })
        .then(() => {
          console.log('Document and its collections deleted successfully.');
        })
        .catch(error => {
          console.error('Error deleting document and collections:', error);
        });
    } else {
      firestore()
        .collection('videoRoom')
        .doc(sellerId)
        .collection('rooms')
        .doc(roomId)
        .collection('callerCandidates') // First collection within 'channelId' document
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        })
        .then(() => {
          // Step 2: Delete all documents within the second collection
          return firestore()
            .collection('videoRoom')
            .doc(sellerId)
            .collection('rooms')
            .doc(roomId)
            .collection('currCallData') // Second collection within 'channelId' document
            .get();
        })
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        })
        .then(() => {
          // Step 3: Delete the 'channelId' document
          return firestore()
            .collection('videoRoom')
            .doc(sellerId)
            .collection('rooms')
            .doc(roomId)
            .delete();
        })
        .then(() => {
          console.log('Document and its collections deleted successfully.');
        })
        .catch(error => {
          console.error('Error deleting document and collections:', error);
        });
    }
    if (allCallUser.length === 0) {
      navigation.navigate('QR_codeScreen');
    }
  }
  useEffect(() => {
    const backAction = async () => {
      // dispatch(addChannelId(null));
      // await onBackPress();
      console.log('Back button pressed');

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

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
    await fetchAllRooms();
    // console.log('join Call rendered before fetching userDAtassss');
    // console.log('join Call rendered after fetching userDAtassss');
    const unsubscribe = database()
      .ref(`/Sellers/${roomId}`)
      .on('value', snapshot => {
        const data = snapshot?.val();
        if (data?.userCallStatus === false) {
          onBackPress();
        }
        // console.log('Data updated:', data);
      });

    // const roomRef = await firestore().collection('rooms').doc(id);
    const roomRef = firestore()
      .collection('videoRoom')
      .doc(sellerId)
      .collection('rooms')
      .doc(id);
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
  InCallManager.start();
  const toggleSpeaker = () => {
    const newMode = !speakerOn;
    setSpeakerOn(newMode);

    // Set the speaker mode
    if (newMode) {
      // setSpeakerphoneOn;
      // InCallManager.setForceSpeakerphoneOn(true);
      InCallManager.setSpeakerphoneOn(true);
    } else {
      // InCallManager.setForceSpeakerphoneOn(false);
      InCallManager.setSpeakerphoneOn(false);
    }
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

  const onClickQueuSeller = async item => {
    console.log('clcked seller is -------------------', item);
    // await onBackPress();
    // await joinCall(item.roomId);
  };

  useEffect(() => {
    // Call function 1
    startLocalStream();
  }, []); // Empty dependency array ensures this runs only once after mount

  useEffect(() => {
    // Check if state1 is updated, then call function 2

    if (startWebCamState === true) {
      joinCall(roomId);
    }
  }, [startWebCamState]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      key={item.id}
      style={styles.rootImgContainer}
      onPress={() => {
        // setClickedSeller(item.id);
        // console.log('itemId---------->', item.id);
        onClickQueuSeller(item);
      }}>
      <View style={styles.imgContainer}>
        {/* <Image style={styles.img} source={{uri: item.data.imageUrl}} /> */}
        <Image style={styles.img} source={{uri: item.photoUrl}} />
      </View>
      {/* <Text style={[FONTS.body3, styles.text]}>{item.data.name}</Text> */}
      <Text style={[FONTS.body3, styles.text]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      {/* <Text style={styles.heading}>Join Screen</Text> */}
      {/* <Text style={styles.heading}>Room : {roomId}</Text> */}

      {/* <View style={styles.callButtons}> */}
      {/* <FlatList
        contentContainerStyle={{
          marginTop: '10%',
          alignItems: 'center',
        }}
        data={allRooms}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
      />
      <Text>Himanshu</Text> */}
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
              style={{width: 40, height: 40, marginTop: 4}}
              source={speakerOn ? speakerOfImg : speakerOnImg}
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
      <View>
        <FlatList
          contentContainerStyle={{
            alignItems: 'center',
          }}
          data={allCallUser}
          renderItem={renderItem}
          keyExtractor={item => item.deviceToken}
          horizontal={true}
          // scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
        />
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
  rootImgContainer: {
    marginTop: 5,
    // paddingHorizontal: '3.4%',
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignItems: 'center',
  },
  imgContainer: {
    width: 70,
    height: 70,
    borderRadius: 45,
    overflow: 'hidden',
    elevation: 5, // This property is for Android
  },
  img: {width: '100%', height: '100%'},
  text: {
    marginTop: 5,
    color: COLORS.darkBlue,
    // color: 'blue',
    fontSize: 16,
  },
});
