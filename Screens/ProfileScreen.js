import React, {useState, useEffect, useRef} from "react";
import GradientBackground from '../Components/LinearGradient';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Alert } from "react-native";
import { Feather } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';

const Stack = createStackNavigator();

const ProfileScreen = ({ navigation }) => {
    const [avatar, setAvatar] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = MediaLibrary.usePermissions()

    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus === "granted");

            const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
            setHasMediaLibraryPermission(mediaLibraryStatus === 'granted');
        })();
    }, []);

    const openAvatarOptions = () => {
        Alert.alert(
            'Change Profile Picture',
            'Choose from the following options:',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Choose a file',
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

    const navigateToCameraView = () => {
        navigation.navigate('CameraView', { currentAvatar: avatar });
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library denied!');
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            console.log('Image picker result:', result);

            if (!result.canceled) {
                setAvatar(result.uri);
            } else {
                console.log('Image picking was cancelled');
            }
        } catch (error) {
            console.log('Error picking an image:', error);
        }
    };

    return (
        <GradientBackground>
        <SafeAreaView style={styles.container}>
            <View>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={openAvatarOptions}>
                        <View style={styles.emptyAvatar}>
                            {avatar ? (
                                <Image source={{ uri: avatar }} style={styles.avatarImage} />
                            ) : (
                                <Feather name="camera" size={24} color="black" />
                            )}
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.username}>Username</Text>
                </View>
            </View>
         </SafeAreaView>
        </GradientBackground>
    );
};


const CameraView = ({ navigation }) => {
    const cameraRef = useRef(null);
    const [avatar, setAvatar] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false); // 


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
                                // Save the captured image to the media library
                                await MediaLibrary.saveToLibraryAsync(data.uri);
                                console.log('Avatar', data);
                                setAvatar(data.uri);
                                navigation.goBack(); // Go back to the profile screen after taking the picture
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

    const onCameraReady = () => {
        setIsCameraReady(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Camera
                style={styles.camera}
                ref={cameraRef}
                onCameraReady={onCameraReady}
                autoFocus={true}
            />
            {isCameraReady && (
                <TouchableOpacity style={styles.takePictureButton} onPress={takePicture}>
                    <Text style={styles.takePictureText}><Feather name="camera" size={24} color="black" /></Text>
                </TouchableOpacity>
            )}


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        alignItems: 'center',
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
        flex: 1,
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
        backgroundColor: '#ccc',
        borderRadius: 50,
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    takePictureText: {
        fontSize: 20,
        color: 'black',
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
                options={{ title: 'Back' }}

            />
        </Stack.Navigator>
    );
}
