import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../Screens/ProfileScreen';
import LoginScreen from '../Screens/LoginScreen';
import { FadeInRight } from 'react-native-reanimated';

const Drawer = createDrawerNavigator();

function ProfileDrawer() {
  return (
    <Drawer.Navigator 
    initialRouteName="Profile"
    screenOptions={{headerShown: false, drawerPosition: 'right'}}
    >
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
    </Drawer.Navigator>
  );
}

export default ProfileDrawer;
