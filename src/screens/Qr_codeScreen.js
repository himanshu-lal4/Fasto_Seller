import {StyleSheet, Text, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import React, {useRef, useState} from 'react';
import VectorIcon from '../../utils/VectorIcon';

const Qr_codeScreen = () => {
  const [text, setText] = useState('');
  const [QRImage, setQRImage] = useState('');
  const ref = useRef();

  const saveQR = () => {
    try {
      ref.current.toDataURL(async data => {
        // console.log(data);       //give 64base URL
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
    <View>
      <Text>Qr_codeScreen</Text>
      <TouchableOpacity onPress={() => saveQR()}>
        <Text style={styles.btn}>Download QR</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleShare()}>
        <Text style={styles.btn}>Share QR</Text>
      </TouchableOpacity>
      <View style={{alignSelf: 'center', marginTop: 50}}>
        <QRCode value={text ? text : 'NA'} size={300} getRef={ref} />
      </View>
    </View>
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
});
