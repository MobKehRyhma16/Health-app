import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';
import ProfileScreen from '../../Screens/ProfileScreen';
import LoginScreen from '../../Screens/LoginScreen';
import Info from './Info';
import Logout from './Logout';
import DrawerStyles from './DrawerStyles';
import { getAuth } from '../../Firebase/Config';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { UserProvider } from '../../helpers/UserProvider';

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
    <UserProvider >
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerPosition: 'right',
        headerLeft: false,
        headerRight: () => <DrawerToggleButton />,
        drawerStyle: DrawerStyles.drawerContainer,
        drawerIcon: ({ color, size }) => {
          let iconName;

          // Set the appropriate icon name based on the route name
          if (route.name === 'Profile') {
            iconName = 'person-outline';
          } else if (route.name === 'Logout') {
            iconName = 'log-out-outline';
          } else if (route.name === 'Login') {
            iconName = 'log-in-outline';
          } else if (route.name === 'My Information') {
            iconName = 'information-circle-outline';
          }

          // Return the Ionicons component with the specified icon name
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      {user ? (
        <Drawer.Screen name="Logout" component={Logout} />
      ) : (
        <Drawer.Screen name="Login" component={LoginScreen} />
      )}
      <Drawer.Screen name="My Information" component={Info} />
    </Drawer.Navigator>
    </UserProvider >
  );
}

export default ProfileDrawer;
