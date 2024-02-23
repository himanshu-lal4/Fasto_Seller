import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AuthHeader from '../Common/AuthHeader';
import {COLORS} from '../../assets/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';

const SubcategoryScreen = ({route}) => {
  const {subCategories} = route.params;
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  // Function to handle checkbox toggle
  const toggleSubcategory = subcategory => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(
        selectedSubcategories.filter(item => item !== subcategory),
      );
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
    }
  };

  // Function to save the selected subcategories
  const saveSelection = () => {
    if ((selectedSubcategories.length = 0)) {
      Alert.alert('Attention', 'Please select at least one subcategory.');
      console.log('Selected Subcategories:', selectedSubcategories);
    } else {
      console.log('Warning: Please select at least one subcategory.');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader tittle={'SELECT A CATEGORY'} />
      <View style={{marginVertical: 25}}>
        <FlatList
          data={subCategories}
          renderItem={({item}) => (
            <View style={styles.section}>
              <CheckBox
                tintColors={{true: COLORS.white, false: 'white'}}
                value={selectedSubcategories.includes(item)}
                onValueChange={() => toggleSubcategory(item)}
              />
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 18,
                  paddingHorizontal: 10,
                }}>
                {item}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity onPress={saveSelection} style={styles.button}>
          <Text style={{fontWeight: '600', color: 'black'}}>
            Save Selection
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SubcategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
    justifyContent: 'flex-start',
  },
  button: {
    height: 45,
    backgroundColor: '#89b9ff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 15,
    backgroundColor: '#082e66',
    borderRadius: 8,
  },
});
