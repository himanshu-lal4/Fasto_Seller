import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import AuthHeader from '../components/Common/AuthHeader';
import Category from '../components/onBoarding/category';
import {useNavigation} from '@react-navigation/native';

const OnBoardScreen = () => {
  const navigation = useNavigation();
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <AuthHeader
          tittle={`LET'S GET YOU STARTED`}
          onPress={() => navigation.goBack()}
        />
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
