import React from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';

const PickupCall = () => {
  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Image
          source={require('../assets/images/userIcon.png')}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Your Name</Text>
      </View>
      <View style={styles.buttonView}>
        <TouchableOpacity style={styles.circleButton}>
          <Text style={styles.buttonText}>Button 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton}>
          <Text style={styles.buttonText}>Button 2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.circleButton}>
          <Text style={styles.buttonText}>Button 3</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100, // Adjust the size of the circle as needed
    height: 100, // Adjust the size of the circle as needed
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonView: {
    flexDirection: 'row',
    marginTop: 20,
  },
  circleButton: {
    width: 50, // Adjust the size of the circle button as needed
    height: 50, // Adjust the size of the circle button as needed
    borderRadius: 25,
    backgroundColor: '#3498db', // Adjust the background color as needed
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PickupCall;
