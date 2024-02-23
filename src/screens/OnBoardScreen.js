import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import AuthHeader from '../components/Common/AuthHeader';
import Category from '../components/onBoarding/category';

const OnBoardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <AuthHeader tittle={`LET'S GET YOU STARTED`} />
        <Category />
      </ScrollView>
    </SafeAreaView>
  );
};

export default OnBoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(18,38,54)',
  },
});
