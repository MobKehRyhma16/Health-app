import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import Login from '../Components/DrawerComponents/Login';
import Signup from '../Components/DrawerComponents/Signup';
import GradientBackground from '../Components/LinearGradient';

export default function LoginScreen({ navigation }) {

  const [logged, setLogged] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const toggleMode = () => {
    setShowSignup(!showSignup); // Toggle between login and signup mode
};
  
  if (logged) {
    navigation.navigate("Home");
  } else {
    return (
      <>
        <GradientBackground>
        {!showSignup && <Login setLogin={setLogged} />}
        {!showSignup && <Button title="Don't have an account?" onPress={toggleMode} />}
        {showSignup && <Signup />}
        </GradientBackground>
      </>
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