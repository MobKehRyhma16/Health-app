import React, { useEffect, useRef, useState } from "react";
import GradientBackground from '../Components/LinearGradient';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Alert } from "react-native";
import { Feather } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { createStackNavigator } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';

const Stack = createStackNavigator();

const ProfileScreen = ({ navigation, route }) => {
    const [avatar, setAvatar] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);

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
    }, [avatar]); // Log whenever avatar state changes

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


const CameraView = ({ navigation, route }) => {
    const cameraRef = useRef(null);
    const [avatar, setAvatar] = useState(route.params.avatar || null);
    const [isCameraReady, setIsCameraReady] = useState(false); // 
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
   
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
        backgroundColor: 'transparent',
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
        width: '100%',
        height: '100%', // Set height to 100%
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