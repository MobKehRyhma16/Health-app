import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Screens/HomeScreen';
import Placeholder from '../Screens/PlaceholderScreen';
import HistoryScreen from '../Screens/HistoryScreen';
import ProfileDrawer from './DrawerComponents/ProfileDrawer';

const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
            <Tab.Navigator screenOptions={{headerShown: false}}>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Placeholder" component={Placeholder} />
                <Tab.Screen name="History" component={HistoryScreen} />
                <Tab.Screen name="Profile" component={ProfileDrawer} />
            </Tab.Navigator>
    );
}
export default MyTabs;