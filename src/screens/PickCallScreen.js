import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS} from '../assets/theme';

const PickCallScreen = ({route}) => {
  const data = route.params;
  console.log('dataaaaa',data);
  return (
    <View style={styles.body}>
      <View style={styles.section}>
        <Text>User Calling</Text>
      </View>
    </View>
  );
};

export default PickCallScreen;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: COLORS.secondaryBackground,
  },
  section: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
