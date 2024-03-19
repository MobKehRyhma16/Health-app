import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';
import ProfileScreen from '../../screens/ProfileScreen';
import LoginScreen from '../../screens/LoginScreen';
import Info from './Info';
import Logout from './Logout';
import DrawerStyles from './DrawerStyles';
import { getAuth } from '../../Firebase/Config';
import { useEffect, useState } from 'react';

const Drawer = createDrawerNavigator();
const auth = getAuth();

function ProfileDrawer() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) {
    return null;
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        headerLeft: false,
        headerRight: () => <DrawerToggleButton />,
        drawerStyle: DrawerStyles.drawerContainer
      }}
    >
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      {user ? (
        <Drawer.Screen name="Logout" component={Logout} />
      ) : (
        <Drawer.Screen name="Login" component={LoginScreen} />
      )}
      <Drawer.Screen name="My Information" component={Info} />
    </Drawer.Navigator>
  );
}

export default ProfileDrawer;
