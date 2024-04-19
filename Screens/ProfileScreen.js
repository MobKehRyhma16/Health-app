import React, { useEffect, useRef, useState, useContext } from "react";
import GradientBackground from '../Components/LinearGradient';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Alert, TextInput } from "react-native";
import { Feather } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { firestore, doc, updateDoc, getDoc, getAuth, db } from '../Firebase/Config';
import { getUserWorkoutTypes } from "../Firebase/profile";
import { UserContext } from "../helpers/UserProvider";
import * as ImageManipulator from 'expo-image-manipulator';



const Stack = createStackNavigator();

const ProfileScreen = ({ navigation, route }) => {
    const [avatar, setAvatar] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [firstname, setFirstname] = useState(null);
    const [currentAvatar, setCurrentAvatar] = useState(null);
    const [description, setDescription] = useState('');
    const [totalWorkoutTypes, setTotalWorkoutTypes] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [isDescriptionChanged, setIsDescriptionChanged] = useState(false); // State to track if description has changed
    const [showSaveButton, setShowSaveButton] = useState(true);

    const auth = getAuth();
    const user = auth.currentUser;
    const uid = user.uid;

    const userId = uid;

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
        if (route.params && route.params.avatar) {
            setAvatar(route.params.avatar);
        }
    }, [route.params]);

    useEffect(() => {
        console.log("Avatar state when picking image:", avatar);
        // Upload avatar path to Firestore when avatar state changes
        const updateUserAvatar = async () => {
            try {
                const userDocRef = doc(firestore, 'users', uid); // Replace 'USER_DOCUMENT_ID' with the actual document ID of the user
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

            const userDocRef = doc(firestore, 'users', uid);
            const userDocSnapshot = await getDoc(userDocRef);
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                if (userData.avatar) {
                    setAvatar(userData.avatar);
                }
                if (userData.firstname) {
                    setFirstname(userData.firstname); // Set the username state here
                }
                if (userData.description) {
                    setDescription(userData.description); // Set the description state here
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

    const handleDescriptionChange = (text) => {
        setDescription(text);
        setIsDescriptionChanged(true); // Set description changed state to true when text changes
        setShowSaveButton(true); // Show the save button when text changes
    };

    const saveDescription = async () => {
        if (description.trim() !== '') {
            try {
                setIsSaving(true);
                const userDocRef = doc(firestore, 'users', uid);
                await updateDoc(userDocRef, { description: description });
                console.log("Description saved to Firestore:", description);
                setIsSaving(false);
                setIsDescriptionChanged(false);
                setShowSaveButton(false); // Hide the save button after it's clicked
            } catch (error) {
                console.error("Error saving description to Firestore:", error);
                setIsSaving(false);
            }
        } else {
            console.log("Description is empty. Not saving to Firestore.");
        }
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

        useEffect(() => {
            fetchUserGoal();
        }, []);

        async function fetchUserGoal() {
            try {

                if (!user) {
                    console.log("No user signed in.");
                    return;
                }

                const userDocRef = doc(db, "users", uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setDailyGoal(userData.dailyGoal || '');
                } else {
                    console.log("User document does not exist.");
                }
            } catch (error) {
                console.error("Error fetching user information:", error);
            }
        }

        async function handleSave() {
            try {
                if (!user) {
                    console.log("No user signed in.");
                    return;
                }

                const uid = user.uid;
                const userDocRef = doc(db, "users", uid);
                await updateDoc(userDocRef, {
                    dailyGoal: dailyGoal
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
                        style={{ borderColor: '#ccc', borderWidth: 1, padding: 5 }}
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        value={description}
                        onChangeText={handleDescriptionChange}
                        placeholder="Enter your profile description"
                        maxLength={120}
                        textAlign="center"
                        multiline={true}
                        numberOfLines={3}
                        textBreakStrategy="highQuality"
                        blurOnSubmit={true}
                    />
                    
                </View>
                {showSaveButton && isDescriptionChanged && ( // Render the save button only if description has changed and showSaveButton is true
                        <TouchableOpacity style={[styles.button, { alignSelf: 'flex-end' }]} onPress={saveDescription} disabled={isSaving}>
                            <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
                        </TouchableOpacity>
                    )}
            
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
        </GradientBackground >
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

                let flippedImageUri = data.uri;
                if (cameraType === Camera.Constants.Type.front) {
                    // Image taken with front camera, so flip horizontally
                    const flippedImage = await ImageManipulator.manipulateAsync(
                        data.uri,
                        [{ flip: ImageManipulator.FlipType.Horizontal }],
                        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
                    );
                    flippedImageUri = flippedImage.uri;
                }
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
                                await MediaLibrary.saveToLibraryAsync(flippedImageUri);
                                navigation.navigate('ProfileScreen', { avatar: flippedImageUri });
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
        width: 104, // Increased size to accommodate the border
        height: 104, // Increased size to accommodate the border
        borderRadius: 52, // Half of the increased size
        borderWidth: 2, // Border width
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        position: 'relative', // Position relative for overlaying the border
    },
    avatarImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        position: 'absolute', // Position absolute to overlay on top of the border
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

    button: {
        backgroundColor: 'lightblue',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: 75,
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
