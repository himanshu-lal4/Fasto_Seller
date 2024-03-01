import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AuthHeader from '../components/Common/AuthHeader';
import Button from '../components/Common/Button';
import {COLORS, FONTS} from '../assets/theme';

const ChooseImgScreen = ({navigation}) => {
  const handlePic = () => {
    navigation.navigate('SelectImage');
  };
  return (
    <View>
      <AuthHeader
        tittle={`Let's set up the store.`}
        onPress={() => navigation.goBack()}
      />
      <Text style={[FONTS.body3, {margin: 10, color: COLORS.black}]}>
        Choose a few pictures of your store!
      </Text>
      <Button tittle={'select pic'} onPress={handlePic} />
    </View>
  );
};

export default ChooseImgScreen;

const styles = StyleSheet.create({});
