import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {servicesProvided} from './ServicesData';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../assets/theme';

const CategoryScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelection = category => {
    setSelectedCategory(category);
    console.log('category', selectedCategory);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      navigation.navigate('SubcategoryScreen', {
        subCategories: selectedCategory.subcategories,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={servicesProvided}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleCategorySelection(item)}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 5,
              }}>
              <RadioButton
                value={item.category}
                status={
                  selectedCategory?.category === item.category
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => handleCategorySelection(item)}
              />
              <Text style={{color: COLORS.white}}>{item.category}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        onPress={handleContinue}
        disabled={!selectedCategory}
        style={styles.button}>
        <Text>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CategoryScreen;
const styles = StyleSheet.create({
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
  container: {
    padding: 10,
  },
});
