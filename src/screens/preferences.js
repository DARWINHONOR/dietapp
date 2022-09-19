import React, {useEffect, useState} from 'react';
import { FlatList, View, StyleSheet, Image} from 'react-native';

import { Button, Text, Divider } from "@react-native-material/core";

import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage';
const App = () => {

  const [pref, setPref] = useState([]);
  /**LLAMADA A LA BD */
  useEffect(() => {
    getPreferences()
  }, []);

  const getPreferences = () => {
    firestore()
    .collection('preferences')
    .get()
    .then(async (preferences) => {
      let tmpPreferences = [];
      let promiseImages = [];
      preferences.forEach(one_preferences => {
        tmpPreferences.push( one_preferences.data() );
        promiseImages.push(storage().ref(one_preferences.data().photo).getDownloadURL());
      })

      const resultPromises = await Promise.all(promiseImages);
      resultPromises.forEach((url, index) => {
        tmpPreferences[index].photo = url;
      });
      setPref(tmpPreferences);
    })
  }

  const ItemPreferences = ( {item} ) => {
    return (
      <View>
        <Image style={styles.image} source={{uri: item.photo}}  />
        <View style={styles.container} >
          <Text  variant='h4'>{item.name}</Text>
        </View>  
        <View style={styles.container}>
          <Text style={styles.label}>Desayuno: </Text><Text> {item.Desayuno == true ? 'Si' : 'No' }</Text>
        </View>   
        <View style={styles.container}>
          <Text style={styles.label}>Merienda: </Text><Text> {item.Merienda == true ? 'Si' : 'No'} </Text>
        </View>
        <View style={styles.container}>  
          <Text style={styles.label}>Almuerzo: </Text><Text>{item.Almuerzo == true ? 'Si' : 'No'} </Text>
        </View>
        <View style={styles.container}>  
          <Text style={styles.label}>Fruta: </Text><Text>{item.Fruta == true ? 'Si' : 'No'} </Text>
        </View>
        <View style={styles.container}>  
          <Text style={styles.label}>Cena: </Text><Text>{item.Cena == true ? 'Si' : 'No'} </Text>
        </View>
        <View style={styles.container}>  
          <Text style={styles.label}>Ejercicio: </Text><Text>{item.Fruta == true ? 'Si' : 'No'} </Text>
        </View>
      </View>
    )
  }

  return (
    <FlatList 
      data={pref}
      renderItem={ItemPreferences}
    />
  )    
};

const styles = StyleSheet.create({
  label:{
    fontWeight: 'bold',
    fontSize: 15
  },
  container:{
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between'
  },
  image:{
    height: 350,
    width: 400
  }
});    

export default App;