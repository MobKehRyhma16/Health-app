import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../Screens/HomeScreen";
import HistoryScreen from "../Screens/HistoryScreen";
import ProfileDrawer from "./DrawerComponents/ProfileDrawer";
import { Ionicons } from "@expo/vector-icons";
<<<<<<< HEAD
import StartWorkoutScreen from "../Screens/StartWorkout";
import WorkoutScreen from "../Screens/CurrentWorkout";
=======
import StartWorkoutScreen from '../Screens/StartWorkout';
import OngoingWorkoutScreen from '../Screens/OngoingWorkoutScreen';
import { UserProvider } from '../helpers/UserProvider';
>>>>>>> 1de0265b9f150b09a47924b7683d1bada9577910

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MyTabs() {
  const size = 24;

<<<<<<< HEAD
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Workout"
        component={StartWorkoutScreen}
        options={{
          tabBarLabel: "Workout",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileDrawer}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
=======
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
                name="Workout"
                component={StartWorkoutScreen}
                options={{
                    tabBarLabel: 'Workout',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map-outline" 
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
                        <Ionicons name="book-outline" 
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

            {/* <Tab.Screen name="OngoingWorkout" component={OngoingWorkoutScreen} /> */}

        </Tab.Navigator>
    );
>>>>>>> 1de0265b9f150b09a47924b7683d1bada9577910
}
export default MyTabs;
