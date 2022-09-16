/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {Text, FlatList, View, StyleSheet, Image} from 'react-native';

import { Button } from "@react-native-material/core";

import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage';
const App = () => {

  const [user, setUser] = useState([]);

  /**LLAMADA A LA BD */
  useEffect(() => {
    getUserInfo()
  }, []);

  const getUserInfo = () => {
    firestore()
    .collection('users_info')
    .get()
    .then(async (users_info) => {
      let tmpUser = [];
      let promiseImages = [];
      users_info.forEach(user_info => {
        tmpUser.push( user_info.data() );
        promiseImages.push(storage().ref(user_info.data().photo).getDownloadURL());
      })

      const resultPromises = await Promise.all(promiseImages);
      resultPromises.forEach((url, index) => {
        tmpUser[index].photo = url;
      });
      setUser(tmpUser);
    })
  }

  const ItemUser = ( {item} ) => {
    return (
      <View>
        <Image style={styles.image} source={{uri: item.photo}}  />
        <View style={styles.container} >
          <Text style={styles.label}>{item.name}</Text>
          </View>  
        <View style={styles.container}>
          <Text style={styles.label}>Fecha de Nacimiento: </Text><Text> 02/01/1986{/*item.date_of_birth.toString()*/}</Text>
        </View>   
        <View style={styles.container}>
          <Text style={styles.label}>Peso Inicial: </Text><Text> {item.weight} Kg</Text>
        </View>
        <View style={styles.container}>  
          <Text style={styles.label}>Altura Inicial: </Text><Text>{item.height} mts</Text>
        </View>
        <View style={styles.container}>  
          <Text style={styles.label}>IMC: </Text><Text>{Math.round(item.weight / (item.height * item.height)).toFixed(2)} </Text>
        </View>

        <Button title="Click Me" onPress={() => alert("🎉🎉🎉")}/>

      </View>
    )
  }

  return (
    <FlatList 
      data={user}
      renderItem={ItemUser}
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
