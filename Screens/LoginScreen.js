import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import Login from '../Components/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';

export default function LoginScreen({ navigation }) {

  const [logged, setLogged] = useState(false);

  if (logged) {
    navigation.navigate('Home');
  } else {
    return (
      <Login setLogin={setLogged} />
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  }
});