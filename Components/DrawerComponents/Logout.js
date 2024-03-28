import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { auth } from '../../Firebase/Config'; // Assuming this is the path to your Firebase config file
import GradientBackground from '../LinearGradient';
import Majakkalogo from '../../Images/MajakkaLogo2.png';
import DrawerStyles from './DrawerStyles';

const Logout = () => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully');
      // You can navigate to a different screen or update the UI as needed after logout
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={DrawerStyles.container}>
        <View style={DrawerStyles.logoContainer}>
          <Image source={Majakkalogo} style={DrawerStyles.logo} resizeMode="contain" />
          <TouchableOpacity style={DrawerStyles.Button} onPress={Logout}>
            <Text style={DrawerStyles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default Logout;
