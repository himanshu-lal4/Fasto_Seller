import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import React, {useEffect, useRef, useState} from 'react';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import {useSelector} from 'react-redux';
import {COLORS, FONTS} from '../assets/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import Button from '../components/Common/Button';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

const Qr_codeScreen = () => {
  const navigation = useNavigation();
  const userToken = useSelector(state => state.userToken.UID);
  console.log('🚀 ~ userToken:', userToken);

  const [text, setText] = useState('');
  const [QRImage, setQRImage] = useState('');
  const ref = useRef();
  useEffect(() => {
    setText(userToken);
  }, [userToken]);
  const saveQR = () => {
    try {
      ref.current.toDataURL(async data => {
        const path =
          RNFetchBlob.fs.dirs.DownloadDir + `/${text.slice(0, 30)}.png`;
        console.log(path);
        await RNFetchBlob.fs.writeFile(path, data, 'base64');
        alert('download successfully');
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = async () => {
    const options = {
      title: 'Share is your QRcode',
      url: QRImage,
    };
    try {
      await Share.open(options);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <SafeAreaView
      style={{backgroundColor: COLORS.secondaryBackground, height: '100%'}}>
      <View style={styles.section}>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <VectorIcon
              name="close"
              type="AntDesign"
              color={COLORS.darkBlue}
              size={30}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.section1}>
          <TouchableOpacity onPress={() => handleShare()}>
            <VectorIcon
              name="share"
              type="feather"
              color={COLORS.darkBlue}
              size={25}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => saveQR()}>
            <VectorIcon
              name="download"
              type="feather"
              color={COLORS.darkBlue}
              size={28}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          alignSelf: 'center',
          marginTop: '30%',
          padding: 20,
          backgroundColor: COLORS.primaryBackgroundColor,
          borderRadius: 17,
        }}>
        <QRCode
          value={text ? text : 'NA'}
          size={230}
          color={COLORS.darkBlue}
          getRef={ref}
        />
      </View>
      <View style={{alignSelf: 'center', marginTop: 10}}>
        <Text
          style={{
            color: COLORS.darkBlue,
            fontSize: 18,
            textAlign: 'center',
            // fontFamily: FONTS.body2,
          }}>
          Hello seller! Here's your QR code.
        </Text>
        <Text
          style={{color: COLORS.darkBlue, fontSize: 18, textAlign: 'center'}}>
          Scan further to see more!
        </Text>
      </View>

      <View style={{marginTop: 100}}>
        <Button
          tittle={'Logout'}
          onPress={() =>
            auth()
              .signOut()
              .then(() => console.log('Logged Out'))
              .catch(err => console.log('err', err))
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Qr_codeScreen;

const styles = StyleSheet.create({
  btn: {
    width: '45%',
    paddingLeft: 60,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    alignSelf: 'center',
    backgroundColor: 'purple',
    color: 'white',
    marginBottom: 20,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  section1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
});
