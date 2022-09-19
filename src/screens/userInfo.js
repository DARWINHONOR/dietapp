import React, {useEffect, useState} from 'react';
import { FlatList, View, StyleSheet, Image} from 'react-native';

import { Button, Text, Divider } from "@react-native-material/core";

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
          <Text  variant='h4'>{item.name}</Text>
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

        <View style={{ backgroundColor:'#F44336', padding:15}}>
          <Text variant='subtitle1' style={{ textAlign:'justify', marginBottom:10, color:'#FFCDD2' }}>
            Tomando en cuenta su peso y estatura, se calculó el indice de masa corporal IMC, cuyo resultado apunta a que usted se encuentra con 
          </Text>
          <Text variant='h6' style={{ textAlign:'center',color:'#FFCDD2' }}>Sobrepeso</Text>
        </View>

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