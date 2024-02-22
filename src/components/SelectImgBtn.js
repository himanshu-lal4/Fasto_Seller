import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';

export default function SelectImgBtn({
  text,
  onPress,
  type,
  bgcolor,
  customStyles,
  disable,
}) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disable}>
      <View
        style={[
          type === 'black'
            ? {...styles.btn, ...customStyles}
            : {...styles.btn2, ...customStyles},
        ]}>
        <Text style={[type === 'black' ? styles.text : styles.text2]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#272727',
    borderWidth: 2,
    borderRadius: 28,
    borderColor: 'white',
    margin: 10,
  },
  btn3: {
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#272727',
    borderWidth: 2,
    borderRadius: 28,
    borderColor: 'white',
    margin: 10,
  },
  text: {
    color: 'white',
    padding: 16,
    paddingHorizontal: 59,
    fontFamily: 'Poppins-Bold',
    fontSize: 15,
  },
  btn2: {
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 28,
    borderColor: 'white',
    margin: 10,
    shadowColor: 'grey',
    elevation: 16,
    shadowRadius: 8,
  },
  text2: {
    color: '#020202',
    padding: 15,
    paddingHorizontal: 53,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
});
