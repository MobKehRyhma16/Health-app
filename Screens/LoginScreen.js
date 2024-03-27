import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import Login from '../Components/DrawerComponents/Login';
import Signup from '../Components/DrawerComponents/Signup';
import GradientBackground from '../Components/LinearGradient';
import DrawerStyles from '../Components/DrawerComponents/DrawerStyles';

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
          {!showSignup &&
            <TouchableOpacity style={DrawerStyles.LongerButton} onPress={toggleMode}>
              <Text style={DrawerStyles.buttonText}>Don't have an account?</Text>
            </TouchableOpacity>}
          {showSignup && <Signup setLogin={setLogged} />}
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