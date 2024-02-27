import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {BlurView} from '@react-native-community/blur';
import SelectImgBtn from './SelectImgBtn';
const height = Dimensions.get('window').height;

const SelectImage = ({setSelectOption}) => {
  //capture Image from Camera
  const captureImage = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('user cencil the action');
      } else if (response.errorCode) {
        console.log(`Error while openig the gallery ${response.errorCode}`);
      } else if (response.errorMessage) {
        console.log(`error message is ${response.errorMessage}`);
      } else {
        console.log(response.assets[0].uri);
      }
    });
  };

  //select Image from gallery
  const chooseFile = () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 0}, response => {
      if (response.didCancel) {
        console.log('user cencil the action');
      } else if (response.errorCode) {
        console.log(`Error while openig the gallery ${response.errorCode}`);
      } else if (response.errorMessage) {
        console.log(`error message is ${response.errorMessage}`);
      } else {
        console.log(response);
      }
    });
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={() => setSelectOption(false)}>
        <BlurView
          style={styles.blurView}
          blurType="dark"
          blurAmount={1}
          blurRadius={4}
          reducedTransparencyFallbackColor="white"
        />
      </TouchableWithoutFeedback>
      <View style={styles.modal}>
        <Text style={styles.text1}>Select Option</Text>
        <View style={styles.twobtns}>
          <SelectImgBtn
            text={'Camera'}
            type={'black'}
            onPress={() => captureImage('photo')}
          />
          <SelectImgBtn
            text={'Gallery'}
            type={'black'}
            onPress={() => chooseFile('photo')}
          />
        </View>
      </View>
    </>
  );
};
export default SelectImage;
const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modal: {
    bottom: 0,
    backgroundColor: 'black',
    height: height * 0.3,
    flexDirection: 'column',
    alignItems: 'center',
    borderTopLeftRadius: 33,
    borderTopRightRadius: 33,
    paddingTop: height / 35,
    marginTop: height - 250,
  },
  text1: {
    fontSize: height / 35,
    color: '#FAFAF8',
    textAlign: 'center',
  },
  text2: {
    color: '#919191',
    fontSize: height / 45,
    textAlign: 'center',
  },
  twobtns: {
    marginTop: 28,
    flexDirection: 'row',
  },
  image: {height: 100, width: 100, borderRadius: 50},
});
