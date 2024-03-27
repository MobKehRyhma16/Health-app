import React, { useState } from 'react';
import { View, Text, TextInput, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import DrawerStyles from './DrawerStyles';
import Majakkalogo from '../../Images/MajakkaLogo2.png';

export default function Login({ setLogin }) {
    
    const [email, setEmail] = useState('testuser@tester.com');
    const [password, setPassword] = useState('test123');

    const login = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
            })
            .catch((error) => {
                if (error.code === 'auth/wrong-password' || error.code == 'auth/user-not-found') {
                    console.log('Invalid credentials!');
                } else if ((error.code === 'auth/too-many-requests')) {
                    console.log('Too many attempts to login.');
                } else {
                    console.log(error.code + ' ' + error.message);
                }
            })
    }
    const LoginHandler = () => {
        login();
        setLogin(true);
    }

    return (
        <SafeAreaView style={DrawerStyles.container}>
             <View style={DrawerStyles.logoContainer}>
                <Image source={Majakkalogo} style={DrawerStyles.logo} resizeMode="contain" />
            </View>
            <View>
                <Text style={[DrawerStyles.heading, DrawerStyles.bold]}>Login</Text>
                <Text style={[DrawerStyles.field, DrawerStyles.bold]}>Email:</Text>
                <TextInput
                    style={[DrawerStyles.field, DrawerStyles.textInput]}
                    keyboardType='default'
                    value={email}
                    onChangeText={text => setEmail(text)}
                    placeholder="Enter your email"
                />
                <Text style={[DrawerStyles.field, DrawerStyles.bold]}>Password:</Text>
                <TextInput
                    style={[DrawerStyles.field, DrawerStyles.textInput]}
                    keyboardType='default'
                    value={password}
                    onChangeText={text => setPassword(text)}
                    placeholder="Enter your password"
                    secureTextEntry={true}
                />
                <TouchableOpacity style={DrawerStyles.Button} onPress={LoginHandler}>
                    <Text style={DrawerStyles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
                                       