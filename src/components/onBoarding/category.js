import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {servicesProvided} from './ServicesData';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../assets/theme';
import {ScrollView} from 'react-native-virtualized-view';
import Button from '../Common/Button';

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
    <>
      <ScrollView>
        <View style={styles.container}>
          <FlatList
            data={servicesProvided}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => handleCategorySelection(item)}>
                <View style={styles.section}>
                  <RadioButton
                    value={item.category}
                    color={'white'}
                    status={
                      selectedCategory?.category === item.category
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => handleCategorySelection(item)}
                  />
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 15,
                      marginHorizontal: 10,
                    }}>
                    {item.category}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
      {/* <TouchableOpacity
        onPress={handleContinue}
        disabled={!selectedCategory}
        style={styles.button}>
        <Text style={{fontWeight: '600', color: 'black'}}>CONTINUE</Text>
      </TouchableOpacity> */}
      <Button tittle={'continue'} onPress={handleContinue} />
    </>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    padding: 15,
    backgroundColor: '#082e66',
    borderRadius: 8,
  },
});
