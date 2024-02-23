import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import AuthHeader from '../components/Common/AuthHeader';
import Category from '../components/onBoarding/category';
import {ScrollView} from 'react-native-virtualized-view';

const OnBoardScreen = () => {
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <AuthHeader tittle={`LET'S GET YOU STARTED`} />
        <Category />
      </SafeAreaView>
    </ScrollView>
  );
};

export default OnBoardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
  },
});
