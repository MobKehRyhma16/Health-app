import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import Placeholder from '../Screens/PlaceholderScreen';
import HistoryScreen from '../Screens/HistoryScreen';
import ProfileDrawer from './DrawerComponents/ProfileDrawer';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo

const Tab = createBottomTabNavigator();

function MyTabs() {
    const size = 24;

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline"
                        size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Placeholder"
                component={Placeholder}
                options={{
                    tabBarLabel: 'Placeholder',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="skull-outline" 
                        size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarLabel: 'History',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="thumbs-up-outline" 
                        size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileDrawer}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" 
                        size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
export default MyTabs;