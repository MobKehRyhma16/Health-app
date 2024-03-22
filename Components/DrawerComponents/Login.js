import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import DrawerStyles from './DrawerStyles';

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
            <View>
                <Text style={DrawerStyles.heading}>Login</Text>
                <Text style={DrawerStyles.field}>Email</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={email} onChangeText={text => setEmail(text)} />
                <Text style={DrawerStyles.field}>Password</Text>
                <TextInput style={DrawerStyles.field} keyboardType='default' value={password} onChangeText={text => setPassword(text)} />
                <Button title='Login' onPress={LoginHandler} />
            </View>
        </SafeAreaView>
    );
};
