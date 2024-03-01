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
import {ScrollView} from 'react-native-virtualized-view';
import {useNavigation} from '@react-navigation/native';
import Button from '../Common/Button';

const SubcategoryScreen = ({route}) => {
  const {subCategories} = route.params;
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const navigation = useNavigation();

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
    if (selectedSubcategories.length == 0) {
      Alert.alert('Attention', 'Please select at least one subcategory.');
      console.log('Selected Subcategories:', selectedSubcategories);
    } else {
      console.log('Warning: Please select at least one subcategory.');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader
        tittle={'SELECT A CATEGORY'}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.subcategoriesContainer}>
        <ScrollView>
          <View style={styles.subcategoryItems}>
            <FlatList
              data={subCategories}
              renderItem={({item}) => (
                <View style={styles.section}>
                  <CheckBox
                    tintColors={{true: COLORS.darkBlue, false: COLORS.darkBlue}}
                    value={selectedSubcategories.includes(item)}
                    onValueChange={() => toggleSubcategory(item)}
                  />
                  <Text
                    style={{
                      color: COLORS.darkBlue,
                      fontSize: 14,
                      paddingHorizontal: 8,
                      fontWeight: 'bold',
                    }}>
                    {item}
                  </Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
            />
          </View>
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <Button tittle={'continue'} onPress={saveSelection} />
      </View>
    </SafeAreaView>
  );
};

export default SubcategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  section: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    boxSizing: 'border-box',
    marginVertical: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: COLORS.secondaryButtonColor,
    borderRadius: 50,
    display: 'inline',
    width: '45%',
  },
  subcategoryItems: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    width: '100%',
  },
  subcategoriesContainer: {
    marginTop: 25,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    marginHorizontal: 15,
  },
});
