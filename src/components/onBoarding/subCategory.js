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
    if (selectedSubcategories.length = 0) {
      Alert.alert('Attention', 'Please select at least one subcategory.');
      console.log('Selected Subcategories:', selectedSubcategories);
    } else {
      console.log('Warning: Please select at least one subcategory.');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <AuthHeader tittle={'SELECT A CATEGORY'} />
        <View style={styles.section}>
          <FlatList
            data={subCategories}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                  marginHorizontal: 10,
                }}>
                <CheckBox
                  tintColors={{true: COLORS.white, false: 'white'}}
                  value={selectedSubcategories.includes(item)}
                  onValueChange={() => toggleSubcategory(item)}
                />
                <Text style={{color: COLORS.white, fontSize: 18}}>{item}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity onPress={saveSelection} style={styles.button}>
            <Text>Save Selection</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubcategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(18,38,54)',
    justifyContent: 'flex-start',
  },
  button: {
    height: 45,
    backgroundColor: COLORS.buttoncolor,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  section: {
    marginVertical: 25,
  },
});
