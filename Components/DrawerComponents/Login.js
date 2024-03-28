import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import DrawerStyles from './DrawerStyles';
import Majakkalogo from '../../Images/MajakkaLogo2.png';

export default function Login({ setLogin }) {

    const [email, setEmail] = useState('testuser@tester.com');
    const [password, setPassword] = useState('test123');
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const login = () => {
        return new Promise((resolve, reject) => {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    resolve(true);
                    return setLogin(true);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    const handleLogin = async () => {
        setIsError(false);
        setErrorMessage('');

        if (email === '' || password === '') {
            setIsError(true);
            setErrorMessage('Please fill in all fields');
            return;
        } else if (password.length < 6) {
            setIsError(true);
            setErrorMessage('Password must be at least 6 characters long');
            return;
        }

        try {
            await login();

        } catch (error) {
            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                setIsError(true);
                setErrorMessage('Invalid credentials!');
            } else if (error.code === 'auth/too-many-requests') {
                setIsError(true);
                setErrorMessage('Too many attempts to login.');
            } else {
                setIsError(true);
                setErrorMessage('Invalid credentials!');
            }
        }
    };
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
                <TouchableOpacity style={DrawerStyles.Button} onPress={handleLogin}>
                    <Text style={DrawerStyles.buttonText}>Login</Text>
                </TouchableOpacity>
                {isError &&
                    <Text style={DrawerStyles.field}>{errorMessage}
                    </Text>}
            </View>
        </SafeAreaView>
    );
};
