import React, { useEffect, useRef, useState, useContext } from "react";
import GradientBackground from '../Components/LinearGradient';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Alert, TextInput } from "react-native";
import { Feather } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { firestore, doc, updateDoc, getDoc, firebase, getAuth, db } from '../Firebase/Config';
import { getUserWorkoutTypes } from "../Firebase/profile";
import { UserContext } from "../Components/UserProvider";

const Stack = createStackNavigator();

const ProfileScreen = ({ navigation, route }) => {
    const [avatar, setAvatar] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [firstname, setFirstname] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState(null);
    const [description, setDescription] = useState('');
    const [totalWorkoutTypes, setTotalWorkoutTypes] = useState(0);

    const userId = 'VlxwyuiQTxRE1w5eii4kcReqhTU2'; // user id for testing
    const workOutTypes = getUserWorkoutTypes(userId)




    useEffect(() => {
        fetchUserData();

        console.log("Total Workout Types:", workOutTypes.totalWorkoutTypes);
    }, []);

    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus === "granted");

            const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
            setHasMediaLibraryPermission(mediaLibraryStatus === 'granted');
        })();
    }, []);

    useEffect(() => {
        if (!userId) {
            return;
        }
    }, [userId]);


    useEffect(() => {
        if (route.params && route.params.avatar) {
            setAvatar(route.params.avatar);
        }
    }, [route.params]);

    useEffect(() => {
        console.log("Avatar state when picking image:", avatar);
        // Upload avatar path to Firestore when avatar state changes
        const updateUserAvatar = async () => {
            try {
                const userDocRef = doc(firestore, 'users', 'VlxwyuiQTxRE1w5eii4kcReqhTU2'); // Replace 'USER_DOCUMENT_ID' with the actual document ID of the user
                await updateDoc(userDocRef, { avatar: avatar });
                console.log("Avatar path updated in Firestore");
            } catch (error) {
                console.error("Error updating avatar path in Firestore:", error);
            }
        };

        // Check if the new avatar path is different from the current avatar path
        if (avatar && avatar !== currentAvatar) {
            setCurrentAvatar(avatar); // Update the current avatar path
            updateUserAvatar(); // Update the avatar in Firestore
        }
    }, [avatar])

    const fetchUserData = async () => {
        try {

            const userDocRef = doc(firestore, 'users', 'VlxwyuiQTxRE1w5eii4kcReqhTU2');
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                if (userData.avatar) {
                    setAvatar(userData.avatar);
                }
                if (userData.firstname) {
                    setFirstname(userData.firstname); // Set the username state here
                }
            }
        } catch (error) {
            console.error("Error fetching user data from Firestore:", error);
        }
    };

    const openAvatarOptions = () => {
        Alert.alert(
            'Change Avatar',
            'Choose from the following options:',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Choose an image',
                    onPress: () => pickImage(),
                },
                {
                    text: 'Take a Picture',
                    onPress: () => navigateToCameraView(),
                },
            ],
            { cancelable: false }
        );
    };

    const saveDescription = (text) => { // Accept text parameter
        setDescription(text); // Update the description state with the entered text
    };


    const navigateToCameraView = () => {
        navigation.navigate('CameraView', { currentAvatar: avatar });
        console.log('Camera permission:', hasCameraPermission);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library denied!');
            return;
        }
        console.log('MediaLibrary permission:', hasMediaLibraryPermission);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setAvatar(result.assets[0].uri);
                console.log('Avatar state after setting:', result.assets[0].uri);
            } else {
                console.log('Image picking was cancelled');
            }
        } catch (error) {
            console.log('Error picking an image:', error);
        }
    };


    const DailyGoal = () => {
        const [dailyGoal, setDailyGoal] = useState('');
        const [goal, setGoal] = useState('');
        const { userId } = useContext(UserContext);
    
        useEffect(() => {
            fetchUserGoal();
        }, []);
    
        async function fetchUserGoal() {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
    
                if (!user) {
                    console.log("No user signed in.");
                    return;
                }
    
                const uid = user.uid;
                const userDocRef = doc(db, "users", uid);
                const docSnap = await getDoc(userDocRef);
    
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setGoal(userData.goal || '');
                } else {
                    console.log("User document does not exist.");
                }
            } catch (error) {
                console.error("Error fetching user information:", error);
            }
        }
    
        async function handleSave() {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
    
                if (!user) {
                    console.log("No user signed in.");
                    return;
                }
    
                const uid = user.uid;
                const userDocRef = doc(db, "users", uid);
                await updateDoc(userDocRef, {
                    goal: dailyGoal
                });
                console.log("User information updated successfully.");
            } catch (error) {
                console.error("Error updating user information:", error);
            }
        }
    
        return (
            <View style={styles.columnContainer}>
                <View style={styles.column}>
                    <Text style={styles.columnHeader}>Daily Step Goal</Text>
                    <TextInput
                        style={{ borderColor: 'gray', borderWidth: 1, padding: 5 }}
                        keyboardType="numeric"
                        onChangeText={setDailyGoal}
                        value={dailyGoal}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={openAvatarOptions}>
                        <View style={styles.emptyAvatar}>
                            {avatar ? (
                                <Image
                                    source={{ uri: avatar }}
                                    style={styles.avatarImage}
                                />
                            ) : (
                                <Feather name="camera" size={24} color="black" />
                            )}
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.username}>{firstname ? firstname : 'Loading...'}</Text>
                </View>
                {/* Profile Description */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.heading}>Profile Description</Text>
                </View>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={saveDescription}
                    placeholder="Enter your profile description"
                    maxLength={120}
                    textAlign="center"
                    multiline={true}
                    numberOfLines={3}
                    textBreakStrategy="highQuality"
                />
                <View style={styles.columnContainer}>
                    <View style={styles.column}>
                        <Text style={styles.columnHeader}>Total Kilometers</Text>
                        {/* Add your Total kilometers data here */}
                        <Text style={{ color: '#ccc' }}>0</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.columnContainer}>
                    <View style={styles.column}>
                        <Text style={styles.columnHeader}>Activities</Text>
                        {/* Add your Activities data here */}
                        <Text style={{ color: '#ccc' }}>{workOutTypes.totalWorkoutTypes}</Text>
                    </View>
                </View>

                <View style={styles.divider} />
                <View>
                    <DailyGoal />
                </View>
            </SafeAreaView>
        </GradientBackground>
    );
};


const CameraView = ({ navigation, route }) => {
    const cameraRef = useRef(null);
    const [avatar, setAvatar] = useState(route.params.avatar || null);
    const [isCameraReady, setIsCameraReady] = useState(false); // 
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back); // Default to back camera


    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, []);


    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            title: 'Back',
            headerTransparent: true,
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const toggleCameraType = () => {
        setCameraType(
            cameraType === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };
    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const data = await cameraRef.current.takePictureAsync({
                    skipProcessing: true,
                });

                Alert.alert(
                    'Save Image',
                    'Do you want to save this image to your library?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Save',
                            onPress: async () => {
                                await MediaLibrary.saveToLibraryAsync(data.uri);
                                navigation.navigate('ProfileScreen', { avatar: data.uri });
                            },
                        },
                    ],
                    { cancelable: false }
                );
            } catch (error) {
                console.log(error);
            }
        }
    };

    useEffect(() => {
        if (avatar !== null) {
            console.log('Avatar state inside camera view:', avatar);
            navigation.goBack();
        }
    }, [avatar, navigation]);

    const onCameraReady = () => {
        setIsCameraReady(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Camera
                ratio="16:9"
                style={styles.camera}
                type={cameraType}
                ref={cameraRef}
                onCameraReady={onCameraReady}
                autoFocus="on"

            />
            {isCameraReady && (
                <TouchableOpacity style={styles.takePictureButton} onPress={takePicture}>
                    <Text style={styles.takePictureText}><Feather name="camera" size={24} color="black" /></Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.toggleCameraButton} onPress={toggleCameraType}>
                <Text style={styles.toggleCameraText}>Toggle Camera</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20, // Added to provide spacing between avatar and columns
    },

    capturedImage: {
        width: '100%',
        height: 300,
        marginTop: 20,
    },
    emptyAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    camera: {
        height: '100%',
        width: '100%',
    },

    takePictureContainer: {
        position: 'absolute',
        bottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },

    takePictureButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black color with 50% transparency
        position: 'absolute',
        borderRadius: 50,
        width: 100,
        height: 100,
        bottom: 20, // Adjust bottom spacing as needed
        left: '50%', // Center the button horizontally
        marginLeft: -50, // Offset by half of the button width to center it
    },
    takePictureText: {
        fontSize: 20,
        color: 'black',
    },

    toggleCameraButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 50,
        padding: 10,
    },
    toggleCameraText: {
        fontSize: 16,
        color: 'white',
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        width: '100%',
        marginVertical: 10,
    },
    columnContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start', // Adjusted to align columns to the left
        alignItems: 'center',
        width: '100%', // Added to ensure columns span the width of the screen
        paddingHorizontal: 20, // Added for spacing between columns and edges
    },
    column: {
        flex: 1, // Added to allow columns to occupy full width
    },
    columnHeader: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    heading: {
        fontSize: 24,
        fontWeight: 'bold',

    },

    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    input: {
        padding: 10,
        marginBottom: 8,
        marginTop: -12,
        maxHeight: 120,
        width: '90%',
    },
});

export default function ProfileScreenWithNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="CameraView"
                component={CameraView}
                options={{
                    title: 'Back',
                    headerTransparent: true,

                }}

            />
        </Stack.Navigator>
    );
}
