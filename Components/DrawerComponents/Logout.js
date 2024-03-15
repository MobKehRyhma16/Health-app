import React from 'react';
import { View, Button } from 'react-native';
import { auth } from '../../Firebase/Config'; // Assuming this is the path to your Firebase config file

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
    <View>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Logout;
