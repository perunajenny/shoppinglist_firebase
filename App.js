import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, FlatList } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBvMT5hwlV3NzJWTb38d97UT2fYovr186E",
    authDomain: "shoppinglist2-76bea.firebaseapp.com",
    projectId: "shoppinglist2-76bea",
    storageBucket: "shoppinglist2-76bea.appspot.com",
    messagingSenderId: "48244783197",
    appId: "1:48244783197:web:48b980091e90783d2235b4"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);


export default function App() {


  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  // Save item into list
  const saveItem = () => {
   push(
     ref(database, 'items/'),
     {'product': product, 'amount': amount});
    console.log(product)
    console.log(amount)
  }

  // Update shopppinglist
  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();

      const items = data ? Object.keys(data).map(key => ({ key, ...data[key]})) : [];
      setItems(items);
      console.log(items)
    });
  }, []);

  const deleteItem = (item) => {
    remove(ref(database, 'items/' + item.key));  
  }

  const listSeparator = () => {
    return (
      <View
        style={{
          height: 5,
          width: "80%",
          backgroundColor: "#fff",
          marginLeft: "10%"
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder='Product' style={{marginTop: 30, fontSize: 18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(product) => setProduct(product)}
        value={product}
        />  
      <TextInput placeholder='Amount' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={(amount) => setAmount(amount)}
        value={amount}/>      
      <Button onPress={saveItem} title="Save" /> 
      <Text style={{marginTop: 30, fontSize: 20}}>Shopping list</Text>
      <FlatList 
        style={{marginLeft : "5%"}}
        keyExtractor={item => item.key} 
        renderItem={({item}) => <View style={styles.listcontainer}><Text style={{fontSize: 18}}>{item.product}, {item.amount}</Text>
        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => deleteItem(item)}> Bought</Text></View>} 
        data={items} 
        ItemSeparatorComponent={listSeparator} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 50
 },
 listcontainer: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  alignItems: 'center'
 },
});